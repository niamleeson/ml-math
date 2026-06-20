/* =====================================================================
   PRACTICE — MODULE 10 (MODERN DEEP LEARNING & AI), set A.
   Problems for the seven Modern-DL lessons. Easy -> hard.
   Same beginner style as the lessons:
     - every symbol named in plain words
     - real numbers, rounding stated
     - 2-6 steps, each with BOTH a "do" and a "why"
   Pushed into window.PRACTICE under each lesson id.
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ================================================================ */
  /* 1. TRANSFORMERS & SELF-ATTENTION                                 */
  /* ================================================================ */
  add("mod-transformer", [
    {
      q: `<p>A query vector and a key vector each have length $d = 16$. What is the scaling factor $\\sqrt{d}$ we divide the raw scores by?</p>`,
      steps: [
        { do: `Read off the head dimension: $d = 16$.`, why: `$d$ is the length of each query and key vector. The formula divides $QK^\\top$ by $\\sqrt{d}$.` },
        { do: `Take the square root: $\\sqrt{16} = 4$.`, why: `Dividing by $\\sqrt{d}$ keeps the scores from blowing up when the vectors are long.` }
      ],
      answer: `$\\sqrt{d} = 4$`
    },
    {
      q: `<p>Two attention weights are $0.7$ and $0.3$. The value vectors are $V_1 = 2$ and $V_2 = 6$. What is the attention output (the weighted blend)?</p>`,
      steps: [
        { do: `Multiply each value by its weight: $0.7 \\times 2 = 1.4$ and $0.3 \\times 6 = 1.8$.`, why: `Self-attention output is a weighted average of the value vectors $V$, using the softmax weights.` },
        { do: `Add the pieces: $1.4 + 1.8 = 3.2$.`, why: `The weighted sum is the token's new, context-aware value.` }
      ],
      answer: `$3.2$`
    },
    {
      q: `<p>Scaled scores for two tokens are $[0, 0]$. What attention weights does the softmax give?</p>`,
      steps: [
        { do: `Exponentiate each score: $e^{0} = 1$ and $e^{0} = 1$. Sum $= 2$.`, why: `Softmax turns scores into weights by exponentiating and then dividing by the total.` },
        { do: `Divide: $1/2 = 0.5$ each.`, why: `Equal scores mean no preference, so attention spreads evenly.` }
      ],
      answer: `$[0.5,\\,0.5]$`
    },
    {
      q: `<p>A raw (unscaled) score is $QK^\\top = 12$ for one pair of tokens, and $d = 9$. What is the scaled score $\\frac{QK^\\top}{\\sqrt{d}}$?</p>`,
      steps: [
        { do: `Find $\\sqrt{d} = \\sqrt{9} = 3$.`, why: `We divide the raw dot product by $\\sqrt{d}$ to keep it tame.` },
        { do: `Divide: $12 / 3 = 4$.`, why: `This scaled score is what goes into the softmax.` }
      ],
      answer: `$4$`
    },
    {
      q: `<p>Compute the dot product score $q^\\top k$ for query $q = [1, 2]$ and key $k = [3, 0]$ (before any scaling).</p>`,
      steps: [
        { do: `Multiply matching entries: $1 \\times 3 = 3$ and $2 \\times 0 = 0$.`, why: `A score is a dot product: multiply matching entries of the query and key.` },
        { do: `Add them: $3 + 0 = 3$.`, why: `The sum of the products is the single number measuring how much this query attends to this key.` }
      ],
      answer: `$q^\\top k = 3$`
    },
    {
      q: `<p>Scaled scores for three tokens are $[1, 1, 1]$. What attention weights does the softmax give?</p>`,
      steps: [
        { do: `Exponentiate: $e^{1} \\approx 2.72$ each. Sum $\\approx 8.15$.`, why: `Softmax exponentiates every score, then normalizes.` },
        { do: `Divide: $2.72 / 8.15 \\approx 0.33$ each.`, why: `All scores equal, so each weight is $1/3 \\approx 0.33$. The exact value of the score does not matter, only the differences do.` }
      ],
      answer: `$[0.33,\\,0.33,\\,0.33]$ (each $\\tfrac{1}{3}$)`
    },
    {
      q: `<p>Scaled scores are $[2, 1, 0]$ for three tokens. Find the softmax attention weights. Use $e^{2} \\approx 7.39$, $e^{1} \\approx 2.72$, $e^{0} = 1$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate each score: $7.39$, $2.72$, $1$.`, why: `Softmax first raises $e$ to each score.` },
        { do: `Sum them: $7.39 + 2.72 + 1 = 11.11$.`, why: `The sum is the normalizer $Z$ that makes the weights add to 1.` },
        { do: `Divide each: $7.39/11.11 \\approx 0.67$, $2.72/11.11 \\approx 0.24$, $1/11.11 \\approx 0.09$.`, why: `Dividing by $Z$ turns scores into weights between 0 and 1 that sum to 1.` }
      ],
      answer: `$[0.67,\\,0.24,\\,0.09]$`
    },
    {
      q: `<p>From the previous problem the weights are $[0.67, 0.24, 0.09]$ and the value vectors are $V_1 = 10$, $V_2 = 5$, $V_3 = 1$. What is the attention output? Round to 2 decimals.</p>`,
      steps: [
        { do: `Weight each value: $0.67 \\times 10 = 6.70$, $0.24 \\times 5 = 1.20$, $0.09 \\times 1 = 0.09$.`, why: `The output is the softmax-weighted sum of the value vectors.` },
        { do: `Add: $6.70 + 1.20 + 0.09 = 7.99$.`, why: `The blend leans on $V_1$ because it had the most attention.` }
      ],
      answer: `$\\approx 7.99$`
    },
    {
      q: `<p>Scaled scores are $[3, 1]$. Find the softmax weights. Use $e^{3} \\approx 20.09$ and $e^{1} \\approx 2.72$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $e^{3} \\approx 20.09$, $e^{1} \\approx 2.72$.`, why: `Softmax raises $e$ to each score.` },
        { do: `Sum: $20.09 + 2.72 = 22.81$.`, why: `This is the normalizer $Z$.` },
        { do: `Divide: $20.09/22.81 \\approx 0.88$, $2.72/22.81 \\approx 0.12$.`, why: `A score gap of 2 already makes one token dominate the attention.` }
      ],
      answer: `$[0.88,\\,0.12]$`
    },
    {
      q: `<p>The raw dot products for one query against three keys are $[6, 3, 0]$, and the head dimension is $d = 4$. Scale them by $\\sqrt{d}$.</p>`,
      steps: [
        { do: `Compute $\\sqrt{d} = \\sqrt{4} = 2$.`, why: `Each raw score is divided by $\\sqrt{d}$ before the softmax.` },
        { do: `Divide each score: $6/2 = 3$, $3/2 = 1.5$, $0/2 = 0$.`, why: `Scaling shrinks the spread so the softmax does not saturate. The scaled scores are $[3, 1.5, 0]$.` }
      ],
      answer: `$[3,\\,1.5,\\,0]$`
    },
    {
      q: `<p>Self-attention runs on a sequence of $n = 5$ tokens. How many query-key score pairs are in the matrix $QK^\\top$?</p>`,
      steps: [
        { do: `Each of the 5 queries compares against all 5 keys: $5 \\times 5$.`, why: `$QK^\\top$ holds a score for every (query, key) pair, so it is an $n \\times n$ matrix.` },
        { do: `Multiply: $5 \\times 5 = 25$.`, why: `This $n^2$ growth is why long sequences are expensive for attention.` }
      ],
      answer: `$25$ pairs`
    },
    {
      q: `<p>A query is $q = [1, 1, 1, 1]$ and a key is $k = [2, 0, 1, 1]$, with $d = 4$. Compute the scaled score $\\frac{q^\\top k}{\\sqrt{d}}$.</p>`,
      steps: [
        { do: `Dot product: $1\\cdot2 + 1\\cdot0 + 1\\cdot1 + 1\\cdot1 = 2 + 0 + 1 + 1 = 4$.`, why: `The score is the sum of products of matching entries.` },
        { do: `Scale: $\\sqrt{4} = 2$, so $4 / 2 = 2$.`, why: `Dividing by $\\sqrt{d}$ keeps the score in a healthy range for the softmax.` }
      ],
      answer: `$2$`
    },
    {
      q: `<p>Two tokens have scaled scores $[s, 0]$. For what score $s$ does the first token get exactly $0.5$ attention weight?</p>`,
      steps: [
        { do: `Write the softmax weight: $\\frac{e^{s}}{e^{s} + e^{0}} = 0.5$.`, why: `The weight equals one half only when both exponentials are equal.` },
        { do: `Set $e^{s} = e^{0} = 1$, so $s = 0$.`, why: `Equal scores give equal weights. Any difference tilts the attention.` }
      ],
      answer: `$s = 0$`
    },
    {
      q: `<p>Temperature scaling: raw scores $[4, 2, 0]$ are divided by temperature $T = 2$ before the softmax. What are the scaled scores, and qualitatively how does the softmax change versus $T = 1$?</p>`,
      steps: [
        { do: `Divide each score by $T = 2$: $4/2 = 2$, $2/2 = 1$, $0/2 = 0$.`, why: `A higher temperature shrinks the gaps between scores.` },
        { do: `Note the spread fell from $4$ down to $2$.`, why: `Smaller gaps make the softmax flatter (weights closer to equal), so attention is less peaked.` }
      ],
      answer: `Scaled scores $[2, 1, 0]$; softmax becomes flatter (less peaked) than at $T = 1$.`
    },
    {
      q: `<p>A query attends to three tokens with scaled scores $[2, 2, 0]$. Find the softmax weights. Use $e^{2} \\approx 7.39$, $e^{0} = 1$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $7.39$, $7.39$, $1$.`, why: `Softmax raises $e$ to each score.` },
        { do: `Sum: $7.39 + 7.39 + 1 = 15.78$.`, why: `This normalizer $Z$ makes the weights sum to 1.` },
        { do: `Divide: $7.39/15.78 \\approx 0.47$, $7.39/15.78 \\approx 0.47$, $1/15.78 \\approx 0.06$.`, why: `The two tied top tokens split the attention nearly equally; the third gets little.` }
      ],
      answer: `$[0.47,\\,0.47,\\,0.06]$`
    },
    {
      q: `<p>Scaled scores are $[1, 0, -1]$. Compute the softmax weights. Use $e^{1} \\approx 2.72$, $e^{0} = 1$, $e^{-1} \\approx 0.37$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $2.72$, $1$, $0.37$.`, why: `Softmax works even with negative scores; $e^{-1}$ is just a small positive number.` },
        { do: `Sum: $2.72 + 1 + 0.37 = 4.09$.`, why: `The normalizer $Z$.` },
        { do: `Divide: $2.72/4.09 \\approx 0.67$, $1/4.09 \\approx 0.24$, $0.37/4.09 \\approx 0.09$.`, why: `The most positive score wins the most weight; the negative score gets the least.` }
      ],
      answer: `$[0.67,\\,0.24,\\,0.09]$`
    },
    {
      q: `<p>Why divide attention scores by $\\sqrt{d}$ instead of by $d$? Suppose each entry of $q$ and $k$ has mean 0 and variance 1, and $d = 64$. Show the typical size of a raw score $q^\\top k$ and that dividing by $\\sqrt{d}$ restores variance 1.</p>`,
      steps: [
        { do: `A raw score is $q^\\top k = \\sum_{i=1}^{d} q_i k_i$. Each term has variance 1, and the $d$ terms are independent, so $\\text{Var}(q^\\top k) = d = 64$.`, why: `Summing $d$ independent variance-1 terms adds the variances.` },
        { do: `So a typical score has size $\\sqrt{64} = 8$ (the standard deviation).`, why: `The standard deviation is the square root of the variance.` },
        { do: `Divide by $\\sqrt{d} = 8$: variance becomes $64 / 8^2 = 1$.`, why: `Dividing a random variable by $c$ divides its variance by $c^2$. Choosing $c = \\sqrt{d}$ restores variance 1, keeping the softmax out of its flat, gradient-killing region.` }
      ],
      answer: `Raw score size $\\approx 8$; dividing by $\\sqrt{d} = 8$ gives variance $1$.`
    },
    {
      q: `<p>Full mini-attention. A query against three keys gives raw scores $[8, 4, 0]$, head dimension $d = 4$, and value scalars $V = [1, 0, -2]$. Compute the output. Use $e^{4} \\approx 54.60$, $e^{2} \\approx 7.39$, $e^{0} = 1$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Scale by $\\sqrt{d} = \\sqrt{4} = 2$: scaled scores $= [8/2, 4/2, 0/2] = [4, 2, 0]$.`, why: `We divide each raw score by $\\sqrt{d}$ before the softmax.` },
        { do: `Exponentiate: $e^{4} \\approx 54.60$, $e^{2} \\approx 7.39$, $e^{0} = 1$. Sum $\\approx 62.99$.`, why: `Softmax exponentiates then normalizes.` },
        { do: `Weights: $54.60/62.99 \\approx 0.87$, $7.39/62.99 \\approx 0.12$, $1/62.99 \\approx 0.02$.`, why: `The big score gap makes the first token dominate.` },
        { do: `Blend the values: $0.87(1) + 0.12(0) + 0.02(-2) = 0.87 + 0 - 0.04 = 0.83$.`, why: `The output is the attention-weighted sum of the value scalars.` }
      ],
      answer: `Output $\\approx 0.83$`
    }
  ]);

  /* ================================================================ */
  /* 2. MULTI-HEAD ATTENTION                                          */
  /* ================================================================ */
  add("mod-multihead", [
    {
      q: `<p>A model has vector size $d = 8$ and $h = 2$ heads. What is the dimension of each head?</p>`,
      steps: [
        { do: `Divide the model size by the number of heads: $8 / 2$.`, why: `Multi-head attention splits the $d$-dimensional vector evenly into $h$ heads.` },
        { do: `Compute $8 / 2 = 4$.`, why: `Each head works in $d/h$ dimensions.` }
      ],
      answer: `Each head has dimension $4$.`
    },
    {
      q: `<p>A model uses $h = 4$ heads, each of dimension $4$. What is the model vector size $d$?</p>`,
      steps: [
        { do: `Multiply the head size by the number of heads: $4 \\times 4$.`, why: `Concatenating $h$ heads of size $d/h$ rebuilds the full vector of size $d$.` },
        { do: `Compute $4 \\times 4 = 16$.`, why: `So $d = 16$.` }
      ],
      answer: `$d = 16$`
    },
    {
      q: `<p>Two heads return the vectors $[1, 2]$ and $[3, 4]$. What is the concatenated output, and what is its length?</p>`,
      steps: [
        { do: `Stack the two vectors side by side: $[1, 2, 3, 4]$.`, why: `Concatenation lines up all the heads' outputs into one long vector.` },
        { do: `Count entries: $2 + 2 = 4$.`, why: `The lengths add up.` }
      ],
      answer: `$[1, 2, 3, 4]$, length $4$`
    },
    {
      q: `<p>A model has vector size $d = 12$ and $h = 3$ heads. What size is each head's query vector, and how long is the concatenated output?</p>`,
      steps: [
        { do: `Head dimension: $12 / 3 = 4$.`, why: `Each head's query, key, and value live in $d/h$ dimensions.` },
        { do: `Concatenated length: $3 \\times 4 = 12$.`, why: `Joining the $h$ heads gives back the original length $d$, so the rest of the network is unchanged.` }
      ],
      answer: `Each query length $4$; concatenated length $12$.`
    },
    {
      q: `<p>A model has $d = 64$ and $h = 8$ heads. What is the per-head dimension?</p>`,
      steps: [
        { do: `Divide: $64 / 8 = 8$.`, why: `Each head gets an equal slice $d/h$ of the model vector.` },
        { do: `State the result: $8$ dimensions per head.`, why: `This is the typical setup in the original Transformer ($d=512$, $h=8$, head size $64$ — here scaled down).` }
      ],
      answer: `$8$ dimensions per head.`
    },
    {
      q: `<p>Each head outputs a vector of length 6, and there are $h = 4$ heads. What length is the vector entering the output matrix $W^O$?</p>`,
      steps: [
        { do: `Concatenate: $4 \\times 6 = 24$.`, why: `$\\text{Concat}$ stacks all head outputs before $W^O$ mixes them.` },
        { do: `So $W^O$ receives a length-24 vector.`, why: `$W^O$ then maps it back to the model size $d$.` }
      ],
      answer: `Length $24$.`
    },
    {
      q: `<p>Why does splitting attention into $h$ heads cost roughly the same as one full-size head? Take $d = 8$, $h = 2$.</p>`,
      steps: [
        { do: `One full head works in $d = 8$ dimensions.`, why: `Its attention cost scales with its dimension.` },
        { do: `Each of the $h = 2$ heads works in $d/h = 4$ dimensions.`, why: `The split divides the work, not duplicates it.` },
        { do: `Total across heads $\\approx 2 \\times 4 = 8$, same as one full head.`, why: `Same budget, but you get $h$ independent focuses instead of one.` }
      ],
      answer: `Same total work ($\\approx 8$), but $2$ separate attention patterns.`
    },
    {
      q: `<p>The output matrix $W^O$ takes a concatenated vector of length 24 and must produce a model vector of length $d = 12$. What are the dimensions (rows $\\times$ columns) of $W^O$ if the output is $W^O$ times the concatenated vector?</p>`,
      steps: [
        { do: `Input length is 24, output length is 12.`, why: `$W^O$ mixes the concatenated heads back into the model size.` },
        { do: `A matrix mapping length-24 to length-12 is $12 \\times 24$.`, why: `Matrix-times-vector: the matrix has (output) rows and (input) columns.` }
      ],
      answer: `$W^O$ is $12 \\times 24$.`
    },
    {
      q: `<p>A model has $d = 30$. The designer wants each head to have dimension 5. How many heads is that?</p>`,
      steps: [
        { do: `Divide model size by head size: $30 / 5 = 6$.`, why: `The heads must tile the full vector: $h \\times (d/h) = d$.` },
        { do: `So $h = 6$ heads.`, why: `Each head sees a length-5 slice and they concatenate back to 30.` }
      ],
      answer: `$h = 6$ heads.`
    },
    {
      q: `<p>Head 1 returns $[0.2, 0.9, -0.1, 0.3]$ and Head 2 returns $[0.5, -0.2, 0.7, 0.1]$. Give the concatenated vector and its length.</p>`,
      steps: [
        { do: `Place Head 2's entries after Head 1's: $[0.2, 0.9, -0.1, 0.3, 0.5, -0.2, 0.7, 0.1]$.`, why: `Concatenation keeps each head's numbers in order, then appends the next head.` },
        { do: `Length: $4 + 4 = 8$.`, why: `The combined vector is ready for $W^O$.` }
      ],
      answer: `$[0.2, 0.9, -0.1, 0.3, 0.5, -0.2, 0.7, 0.1]$, length $8$.`
    },
    {
      q: `<p>A model has $d = 100$ and uses $h = 5$ heads. After attention, each head output is length $d/h$. What total length results from concatenating all heads?</p>`,
      steps: [
        { do: `Per-head length: $100 / 5 = 20$.`, why: `Each head works in $d/h$ dimensions.` },
        { do: `Concatenate $h = 5$ heads: $5 \\times 20 = 100$.`, why: `The concatenation returns exactly the model size $d$, by design.` }
      ],
      answer: `Length $100$ (equal to $d$).`
    },
    {
      q: `<p>Can a model have $d = 10$ and $h = 4$ equally-sized heads? Explain with the arithmetic.</p>`,
      steps: [
        { do: `Check $d / h = 10 / 4 = 2.5$.`, why: `Each head needs an equal whole-number slice of the vector.` },
        { do: `$2.5$ is not a whole number, so this split is invalid.`, why: `$h$ must divide $d$ evenly for equal heads. You would need $h \\in \\{1, 2, 5, 10\\}$.` }
      ],
      answer: `No — $10/4 = 2.5$ is not a whole number; $h$ must divide $d$.`
    },
    {
      q: `<p>A Transformer layer has $h = 8$ heads, model size $d = 64$. How many total head-output numbers are produced per token before $W^O$, and how does that compare to $d$?</p>`,
      steps: [
        { do: `Per-head size: $64 / 8 = 8$.`, why: `Each head outputs $d/h$ numbers.` },
        { do: `Total across heads: $8 \\times 8 = 64$.`, why: `Concatenating all heads gives $64$ numbers.` },
        { do: `Compare: $64 = d$.`, why: `By construction the concatenation equals the model size, so $W^O$ is a square $d \\times d$ mix.` }
      ],
      answer: `$64$ numbers, exactly equal to $d$.`
    },
    {
      q: `<p>Within one head, $d/h = 4$, and the head's scaled scores for 2 keys are $[1, 0]$. Find the head's attention weights. Use $e^{1} \\approx 2.72$, $e^{0} = 1$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $2.72$ and $1$. Sum $= 3.72$.`, why: `Each head runs its own scaled-dot-product softmax independently.` },
        { do: `Divide: $2.72/3.72 \\approx 0.73$, $1/3.72 \\approx 0.27$.`, why: `These weights are local to this one head; other heads compute their own.` }
      ],
      answer: `$[0.73,\\,0.27]$`
    },
    {
      q: `<p>Compare cost: a single big head in $d = 16$ dimensions versus $h = 4$ heads of size 4. Using "work scales with dimension" as a rough proxy, give the total dimension processed in each case.</p>`,
      steps: [
        { do: `Single head: processes $d = 16$ dimensions.`, why: `One head spans the whole vector.` },
        { do: `Four heads: each processes $16/4 = 4$, total $4 \\times 4 = 16$.`, why: `Splitting divides the work among heads, summing back to $d$.` },
        { do: `Both total $16$.`, why: `Multi-head is nearly free relative to one big head, yet gives $4$ distinct attention patterns.` }
      ],
      answer: `Both $\\approx 16$; multi-head gives 4 views for the same budget.`
    },
    {
      q: `<p>A model has model size $d$ and $h$ heads with per-head dimension 8. If you double the number of heads to $2h$ but keep $d$ fixed, what happens to the per-head dimension?</p>`,
      steps: [
        { do: `Per-head dimension is $d/h = 8$, so $d = 8h$.`, why: `Heads evenly tile the model vector.` },
        { do: `With $2h$ heads: $d/(2h) = 8h/(2h) = 4$.`, why: `Doubling heads halves each head's slice, since the total $d$ is shared.` }
      ],
      answer: `Per-head dimension halves to $4$.`
    },
    {
      q: `<p>Two heads of size 3 produce $[1, 0, 2]$ and $[-1, 4, 0]$. They concatenate, then $W^O$ (a $2 \\times 6$ matrix) maps to the output. The first row of $W^O$ is $[1, 0, 0, 1, 0, 0]$. What is the first entry of the final output?</p>`,
      steps: [
        { do: `Concatenate the heads: $[1, 0, 2, -1, 4, 0]$.`, why: `$W^O$ acts on the concatenated head outputs.` },
        { do: `Dot the first row of $W^O$ with it: $1(1) + 0(0) + 0(2) + 1(-1) + 0(4) + 0(0)$.`, why: `Each output entry is a dot product of a $W^O$ row with the concatenated vector.` },
        { do: `Sum: $1 + 0 + 0 - 1 + 0 + 0 = 0$.`, why: `This row picks the 1st entry of head 1 and the 1st entry of head 2 and adds them: $1 + (-1) = 0$.` }
      ],
      answer: `First output entry $= 0$.`
    }
  ]);

  /* ================================================================ */
  /* 3. LARGE LANGUAGE MODELS (BERT / GPT)                            */
  /* ================================================================ */
  add("mod-llm", [
    {
      q: `<p>A model's vocabulary has 50,000 words. How many logits (raw scores) does it produce for one next-word prediction?</p>`,
      steps: [
        { do: `One logit per vocabulary word: $50{,}000$ words.`, why: `The model scores every possible next token before the softmax.` },
        { do: `So there are $50{,}000$ logits.`, why: `The softmax then turns all of them into probabilities that sum to 1.` }
      ],
      answer: `$50{,}000$ logits.`
    },
    {
      q: `<p>Logits for ["yes", "no"] are $[2, 0]$ at temperature $T = 1$. What probability does the model give "yes"? Use $e^{2} \\approx 7.39$, $e^{0} = 1$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $e^{2} \\approx 7.39$, $e^{0} = 1$. Sum $= 8.39$.`, why: `Softmax exponentiates each logit, then normalizes.` },
        { do: `Divide: $7.39 / 8.39 \\approx 0.88$.`, why: `"yes" gets about 88% of the probability mass.` }
      ],
      answer: `$P(\\text{yes}) \\approx 0.88$`
    },
    {
      q: `<p>The softmax probabilities over a tiny vocabulary are $[0.6, 0.3, 0.1]$. Which word is the model's top guess, and do the probabilities sum to 1?</p>`,
      steps: [
        { do: `Find the largest probability: $0.6$ (the first word).`, why: `The biggest probability is the model's top guess for the next word.` },
        { do: `Add them: $0.6 + 0.3 + 0.1 = 1.0$.`, why: `A valid softmax output always sums to 1.` }
      ],
      answer: `First word; sum $= 1.0$.`
    },
    {
      q: `<p>Logits are $[1, 1, 1]$ over three words at $T = 1$. What probability does each word get?</p>`,
      steps: [
        { do: `Exponentiate: $e^{1} \\approx 2.72$ each. Sum $\\approx 8.15$.`, why: `Softmax raises $e$ to each logit.` },
        { do: `Divide: $2.72 / 8.15 \\approx 0.33$ each.`, why: `Equal logits give a uniform $1/3$ distribution.` }
      ],
      answer: `$\\approx 0.33$ each.`
    },
    {
      q: `<p>Logits $z = [3.2, 2.1, 1.0]$ for ["mat", "sofa", "roof"] at $T = 1$. Find the probabilities. Use $e^{3.2} \\approx 24.5$, $e^{2.1} \\approx 8.2$, $e^{1.0} \\approx 2.7$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $24.5$, $8.2$, $2.7$.`, why: `Softmax exponentiates every logit.` },
        { do: `Sum: $24.5 + 8.2 + 2.7 = 35.4$.`, why: `This is the normalizer over the whole vocabulary.` },
        { do: `Divide: $24.5/35.4 \\approx 0.69$, $8.2/35.4 \\approx 0.23$, $2.7/35.4 \\approx 0.08$.`, why: `"mat" wins at 69%; the model would likely emit "mat".` }
      ],
      answer: `$[0.69,\\,0.23,\\,0.08]$`
    },
    {
      q: `<p>Logits are $[4, 2]$. With temperature $T = 2$, what are the temperature-scaled logits $z_v / T$ that go into the softmax?</p>`,
      steps: [
        { do: `Divide each logit by $T = 2$: $4/2 = 2$, $2/2 = 1$.`, why: `Temperature divides the logits before the softmax.` },
        { do: `Scaled logits $= [2, 1]$.`, why: `Higher $T$ shrinks the gap, flattening the output distribution.` }
      ],
      answer: `$[2,\\,1]$`
    },
    {
      q: `<p>Qualitatively, what happens to the next-word distribution as temperature $T$ rises far above 1? What about as $T$ falls near 0?</p>`,
      steps: [
        { do: `Large $T$: logits $z_v/T$ shrink toward 0, so all $e^{z_v/T} \\to 1$.`, why: `Dividing by a big number makes the logits nearly equal, flattening the softmax toward uniform.` },
        { do: `Small $T$: logits $z_v/T$ blow up, exaggerating gaps.`, why: `The largest logit dominates, so the top word's probability approaches 1 (sharp, repetitive).` }
      ],
      answer: `High $T$ flattens toward uniform (creative); low $T$ sharpens toward the top word (focused).`
    },
    {
      q: `<p>A sentence has 4 words. Using the chain rule, how many next-token factors does its probability $P(x_1, x_2, x_3, x_4)$ break into?</p>`,
      steps: [
        { do: `Apply the product rule: $P(x_1)P(x_2 \\mid x_1)P(x_3 \\mid x_1 x_2)P(x_4 \\mid x_1 x_2 x_3)$.`, why: `The chain rule splits a joint probability into one conditional per word.` },
        { do: `Count the factors: 4.`, why: `Each factor is exactly one next-token prediction, which is what the LLM is trained to do.` }
      ],
      answer: `$4$ factors.`
    },
    {
      q: `<p>Logits over ["cat", "dog"] are $[1, 1]$ at $T = 1$. Then a fact pushes "cat" to logit 3 (now $[3, 1]$). Compute "cat"'s probability before and after. Use $e^{1} \\approx 2.72$, $e^{3} \\approx 20.09$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Before, $[1, 1]$: each $e^{1} \\approx 2.72$, sum $5.44$, so $P(\\text{cat}) = 2.72/5.44 = 0.50$.`, why: `Tied logits split evenly.` },
        { do: `After, $[3, 1]$: $e^{3} \\approx 20.09$, $e^{1} \\approx 2.72$, sum $22.81$.`, why: `Raising "cat"'s logit raises its exponential.` },
        { do: `Divide: $20.09/22.81 \\approx 0.88$.`, why: `Higher logit, higher probability — the model grew more confident in "cat".` }
      ],
      answer: `Before $0.50$, after $\\approx 0.88$.`
    },
    {
      q: `<p>The true next word has predicted probability $p = 0.25$. What is the cross-entropy loss $-\\ln p$ for this prediction? Use $\\ln 0.25 \\approx -1.386$.</p>`,
      steps: [
        { do: `Take the negative log of the true word's probability: $-\\ln(0.25)$.`, why: `Language models train by maximizing the true next word's probability, i.e. minimizing $-\\ln p$.` },
        { do: `Compute: $-(-1.386) = 1.386$.`, why: `Lower probability on the true word means a larger loss; the model is penalized for being wrong.` }
      ],
      answer: `$-\\ln p \\approx 1.39$`
    },
    {
      q: `<p>Two predictions assign the true word probabilities $0.9$ and $0.1$. Which has the lower cross-entropy loss, and roughly by how much? Use $\\ln 0.9 \\approx -0.105$, $\\ln 0.1 \\approx -2.303$.</p>`,
      steps: [
        { do: `Loss when $p = 0.9$: $-\\ln 0.9 \\approx 0.105$.`, why: `Confident-and-correct gives a small loss.` },
        { do: `Loss when $p = 0.1$: $-\\ln 0.1 \\approx 2.303$.`, why: `Low probability on the true word gives a big loss.` },
        { do: `Difference: $2.303 - 0.105 \\approx 2.2$.`, why: `The confident prediction is far better; cross-entropy heavily rewards putting mass on the true word.` }
      ],
      answer: `$p = 0.9$ is lower by $\\approx 2.20$.`
    },
    {
      q: `<p>Logits $[2, 0, -2]$ at $T = 1$. Find the softmax probabilities. Use $e^{2} \\approx 7.39$, $e^{0} = 1$, $e^{-2} \\approx 0.14$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $7.39$, $1$, $0.14$.`, why: `Negative logits give small positive exponentials.` },
        { do: `Sum: $7.39 + 1 + 0.14 = 8.53$.`, why: `The normalizer over the vocabulary.` },
        { do: `Divide: $7.39/8.53 \\approx 0.87$, $1/8.53 \\approx 0.12$, $0.14/8.53 \\approx 0.02$.`, why: `The top logit dominates while the negative one is nearly ignored.` }
      ],
      answer: `$[0.87,\\,0.12,\\,0.02]$`
    },
    {
      q: `<p>At $T = 1$, logits $[2, 1]$ give "A" probability about $0.73$. Recompute "A"'s probability at $T = 0.5$ (sharper). Use $e^{4} \\approx 54.60$, $e^{2} \\approx 7.39$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Scale logits by $1/T$: $2/0.5 = 4$, $1/0.5 = 2$.`, why: `Low temperature divides by a small number, exaggerating the gap.` },
        { do: `Exponentiate: $e^{4} \\approx 54.60$, $e^{2} \\approx 7.39$. Sum $= 61.99$.`, why: `Softmax on the scaled logits.` },
        { do: `Divide: $54.60/61.99 \\approx 0.88$.`, why: `Lowering $T$ from 1 to 0.5 raised "A" from 0.73 to 0.88 — sharper, more confident.` }
      ],
      answer: `$P(\\text{A}) \\approx 0.88$ at $T = 0.5$.`
    },
    {
      q: `<p>A GPT model generates 3 tokens with per-step true-token probabilities $0.5$, $0.4$, $0.25$. What is the probability of the whole 3-token sequence, by the chain rule?</p>`,
      steps: [
        { do: `Multiply the per-step probabilities: $0.5 \\times 0.4 \\times 0.25$.`, why: `The chain rule says the sequence probability is the product of the conditional next-token probabilities.` },
        { do: `Compute: $0.5 \\times 0.4 = 0.20$; $0.20 \\times 0.25 = 0.05$.`, why: `Each factor is one next-token prediction.` }
      ],
      answer: `$0.05$`
    },
    {
      q: `<p>"Greedy" decoding always picks the highest-probability token. Given softmax output $[0.45, 0.40, 0.15]$ for ["the", "a", "an"], which token does greedy decoding emit, and how does raising temperature risk a different choice?</p>`,
      steps: [
        { do: `Pick the max probability: $0.45$ → "the".`, why: `Greedy decoding takes the single most likely token.` },
        { do: `Note "the" (0.45) barely beats "a" (0.40).`, why: `The gap is small.` },
        { do: `Raising $T$ flattens the distribution, narrowing the gap further; sampling could then pick "a".`, why: `Higher temperature increases the chance of choosing a non-top token, adding variety.` }
      ],
      answer: `Greedy emits "the"; higher $T$ makes "a" a likely sample instead.`
    },
    {
      q: `<p>The cross-entropy loss for one word is $1.386$ nats. Convert it to "perplexity" $= e^{\\text{loss}}$. Use $e^{1.386} \\approx 4$.</p>`,
      steps: [
        { do: `Exponentiate the loss: $e^{1.386} \\approx 4$.`, why: `Perplexity is $e$ raised to the cross-entropy; it measures how many words the model is effectively "confused" among.` },
        { do: `State: perplexity $\\approx 4$.`, why: `A perplexity of 4 means the model is as unsure as if choosing uniformly among 4 equally-likely words.` }
      ],
      answer: `Perplexity $\\approx 4$.`
    },
    {
      q: `<p>Logits $[5, 0]$ over ["X", "Y"]. Compare $P(\\text{X})$ at $T = 1$ versus $T = 5$. Use $e^{5} \\approx 148.4$, $e^{0} = 1$, $e^{1} \\approx 2.72$. Round to 2 decimals.</p>`,
      steps: [
        { do: `At $T = 1$: $e^{5} \\approx 148.4$, $e^{0} = 1$, sum $149.4$, so $P(\\text{X}) = 148.4/149.4 \\approx 0.99$.`, why: `A large logit gap makes "X" almost certain.` },
        { do: `At $T = 5$: scaled logits $5/5 = 1$ and $0/5 = 0$; $e^{1} \\approx 2.72$, $e^{0} = 1$, sum $3.72$.`, why: `Dividing by $T = 5$ shrinks the gap dramatically.` },
        { do: `Divide: $2.72/3.72 \\approx 0.73$.`, why: `Raising temperature pulled "X" from 0.99 down to 0.73 — much less certain.` }
      ],
      answer: `$P(\\text{X}) \\approx 0.99$ at $T=1$, $\\approx 0.73$ at $T=5$.`
    }
  ]);

  /* ================================================================ */
  /* 4. AUTOENCODERS                                                  */
  /* ================================================================ */
  add("mod-autoencoder", [
    {
      q: `<p>An autoencoder takes a 100-number input and squeezes it to a 10-number code. What is the compression ratio (input size to code size)?</p>`,
      steps: [
        { do: `Form the ratio: input over code, $100 / 10$.`, why: `Compression ratio compares how many numbers go in versus how many the bottleneck keeps.` },
        { do: `Compute: $100 / 10 = 10$.`, why: `The code is 10 times smaller than the input.` }
      ],
      answer: `$10\\times$ compression.`
    },
    {
      q: `<p>An autoencoder reconstructs $x = [1, 0]$ as $\\hat{x} = [0.8, 0.1]$. What is the squared-error reconstruction loss $\\lVert x - \\hat{x} \\rVert^2$?</p>`,
      steps: [
        { do: `Find each gap: $1 - 0.8 = 0.2$ and $0 - 0.1 = -0.1$.`, why: `Reconstruction loss measures how far each rebuilt entry is from the original.` },
        { do: `Square and add: $0.2^2 + (-0.1)^2 = 0.04 + 0.01 = 0.05$.`, why: `Squaring makes all gaps positive and penalizes larger errors more.` }
      ],
      answer: `$\\mathcal{L} = 0.05$`
    },
    {
      q: `<p>An autoencoder reconstructs $x = [2, 2]$ perfectly as $\\hat{x} = [2, 2]$. What is the reconstruction loss?</p>`,
      steps: [
        { do: `Gaps: $2 - 2 = 0$ and $2 - 2 = 0$.`, why: `A perfect copy has no difference between input and output.` },
        { do: `Square and add: $0^2 + 0^2 = 0$.`, why: `Zero loss means the bottleneck captured everything (only possible if the data truly fits the code size).` }
      ],
      answer: `$\\mathcal{L} = 0$`
    },
    {
      q: `<p>A 28×28 grayscale image is flattened into a vector and encoded to a code of length 32. How many numbers are in the input, and what is the compression ratio?</p>`,
      steps: [
        { do: `Input size: $28 \\times 28 = 784$ numbers.`, why: `Flattening a 28×28 image lists every pixel as one number.` },
        { do: `Ratio: $784 / 32 = 24.5$.`, why: `The code stores 24.5 times fewer numbers than the image.` }
      ],
      answer: `Input $784$; ratio $\\approx 24.5\\times$.`
    },
    {
      q: `<p>Input $x = [0.8, 0.2, 0.9, 0.1, 0.6]$ rebuilt as $\\hat{x} = [0.79, 0.25, 0.85, 0.18, 0.55]$. Compute the mean squared error (average over the 5 entries). Round to 4 decimals.</p>`,
      steps: [
        { do: `Gaps: $0.01, -0.05, 0.05, -0.08, 0.05$.`, why: `Subtract each reconstruction from its input.` },
        { do: `Square: $0.0001, 0.0025, 0.0025, 0.0064, 0.0025$. Sum $= 0.0140$.`, why: `Squaring removes signs and the sum is the total squared error.` },
        { do: `Divide by 5: $0.0140 / 5 = 0.0028$.`, why: `Mean squared error averages over the entries, giving a per-entry error.` }
      ],
      answer: `MSE $= 0.0028$`
    },
    {
      q: `<p>An encoder maps a length-5 input to a code via the weight row $[0.5, 0.1, 0.5, 0.0, 0.3]$. For input $x = [0.8, 0.2, 0.9, 0.1, 0.6]$, what is this code value?</p>`,
      steps: [
        { do: `Multiply matching entries: $0.5(0.8) + 0.1(0.2) + 0.5(0.9) + 0.0(0.1) + 0.3(0.6)$.`, why: `A linear encoder forms each code number as a weighted sum of the inputs.` },
        { do: `Compute: $0.40 + 0.02 + 0.45 + 0 + 0.18 = 1.05$.`, why: `This single number is one entry of the bottleneck code $z$.` }
      ],
      answer: `Code value $= 1.05$`
    },
    {
      q: `<p>A decoder rebuilds an output entry from a 2-number code $z = [1.1, 0.4]$ using the weight row $[0.9, 0.0]$. What is that output entry?</p>`,
      steps: [
        { do: `Multiply matching entries: $0.9(1.1) + 0.0(0.4)$.`, why: `A linear decoder forms each reconstruction entry as a weighted sum of the code.` },
        { do: `Compute: $0.99 + 0 = 0.99$.`, why: `This is one entry of the reconstruction $\\hat{x}$.` }
      ],
      answer: `Output entry $= 0.99$`
    },
    {
      q: `<p>Why can a 2-number code rebuild 5 truly-independent numbers only with loss? Reason about information.</p>`,
      steps: [
        { do: `The decoder must produce 5 outputs from only 2 inputs.`, why: `The bottleneck holds just 2 free numbers.` },
        { do: `5 independent numbers carry more information than 2 can hold.`, why: `You cannot pack 5 free values into 2 without discarding something.` },
        { do: `So perfect reconstruction is impossible unless the 5 inputs are correlated (really live on a 2-D surface).`, why: `The bottleneck forces the model to find hidden low-dimensional structure; with linear layers this recovers the top principal components.` }
      ],
      answer: `Impossible without loss unless the data is correlated; the bottleneck forces low-dimensional structure.`
    },
    {
      q: `<p>One autoencoder has reconstruction loss $0.002$ on normal transactions but $0.4$ on a suspicious one. What does this suggest, and why?</p>`,
      steps: [
        { do: `Compare losses: $0.4$ is far larger than $0.002$.`, why: `The model learned to rebuild normal data well, so normal inputs have tiny error.` },
        { do: `Flag the high-error input as anomalous.`, why: `An autoencoder reconstructs unfamiliar (fraud) inputs badly, so its error spikes — the basis of anomaly detection.` }
      ],
      answer: `The high-error transaction is likely an anomaly (fraud).`
    },
    {
      q: `<p>A code has 3 numbers and the input has 48 numbers. After training, what compression ratio does the autoencoder achieve?</p>`,
      steps: [
        { do: `Divide: $48 / 3 = 16$.`, why: `Compression ratio is input size over code size.` },
        { do: `State: $16\\times$.`, why: `The code is 16 times smaller, so storing or transmitting the code is much cheaper than the raw input.` }
      ],
      answer: `$16\\times$ compression.`
    },
    {
      q: `<p>Reconstruction $\\hat{x} = [0.5, 0.5, 0.5]$ for input $x = [0.5, 1.0, 0.0]$. Compute the squared-error loss $\\sum_i (x_i - \\hat{x}_i)^2$.</p>`,
      steps: [
        { do: `Gaps: $0.5-0.5 = 0$, $1.0-0.5 = 0.5$, $0.0-0.5 = -0.5$.`, why: `Subtract reconstruction from input for each entry.` },
        { do: `Square and sum: $0^2 + 0.5^2 + (-0.5)^2 = 0 + 0.25 + 0.25 = 0.5$.`, why: `The squared terms add up to the total reconstruction loss.` }
      ],
      answer: `$\\mathcal{L} = 0.5$`
    },
    {
      q: `<p>A linear autoencoder has encoder $z = w^\\top x$ with $w = [1, 1]$ and decoder $\\hat{x} = z \\cdot [0.5, 0.5]$. For $x = [3, 1]$, find $z$, then $\\hat{x}$, then the loss.</p>`,
      steps: [
        { do: `Encode: $z = 1(3) + 1(1) = 4$.`, why: `The code is the weighted sum of the input.` },
        { do: `Decode: $\\hat{x} = 4 \\times [0.5, 0.5] = [2, 2]$.`, why: `The decoder scales its weight vector by the single code number.` },
        { do: `Loss: $(3-2)^2 + (1-2)^2 = 1 + 1 = 2$.`, why: `Squeezing two numbers through a 1-D code lost the difference between them, raising the error.` }
      ],
      answer: `$z = 4$, $\\hat{x} = [2, 2]$, $\\mathcal{L} = 2$`
    },
    {
      q: `<p>A denoising autoencoder gets a noisy input but is trained to output the clean version. If the noisy input is $[0.9, 0.1]$ and the clean target is $[1.0, 0.0]$, what target loss is the network minimizing if its output is $[0.95, 0.05]$?</p>`,
      steps: [
        { do: `Compare the output to the clean target, not the noisy input: gaps $1.0-0.95 = 0.05$, $0.0-0.05 = -0.05$.`, why: `A denoising autoencoder's target is the clean signal, so loss is measured against the clean version.` },
        { do: `Square and sum: $0.05^2 + (-0.05)^2 = 0.0025 + 0.0025 = 0.005$.`, why: `Minimizing this teaches the network to strip noise.` }
      ],
      answer: `$\\mathcal{L} = 0.005$ (against the clean target).`
    },
    {
      q: `<p>An autoencoder's code length is $k$. As you shrink $k$ from 50 to 2, what happens to (a) compression and (b) reconstruction error, and why?</p>`,
      steps: [
        { do: `(a) Compression rises: smaller $k$ means a higher input/code ratio.`, why: `Fewer code numbers store the same input, so each code number carries more.` },
        { do: `(b) Reconstruction error generally rises.`, why: `A tighter bottleneck can keep less information, so the rebuild is less faithful.` },
        { do: `There is a trade-off between the two.`, why: `You pick $k$ to balance compact codes against acceptable error.` }
      ],
      answer: `Smaller $k$: more compression but more error — a trade-off.`
    },
    {
      q: `<p>Compute the total squared-error loss for a 4-entry reconstruction: $x = [1, 2, 3, 4]$, $\\hat{x} = [1.2, 1.8, 2.5, 4.1]$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Gaps: $-0.2, 0.2, 0.5, -0.1$.`, why: `Subtract each reconstruction from its input.` },
        { do: `Square: $0.04, 0.04, 0.25, 0.01$.`, why: `Squaring removes signs.` },
        { do: `Sum: $0.04 + 0.04 + 0.25 + 0.01 = 0.34$.`, why: `The total squared error is the loss the autoencoder minimizes.` }
      ],
      answer: `$\\mathcal{L} = 0.34$`
    },
    {
      q: `<p>An image of $32 \\times 32 \\times 3$ (RGB) pixels is encoded to a 256-number code. Find the input size and the compression ratio. Round the ratio to 1 decimal.</p>`,
      steps: [
        { do: `Input size: $32 \\times 32 \\times 3 = 3072$ numbers.`, why: `RGB means 3 color channels per pixel, all flattened into one vector.` },
        { do: `Ratio: $3072 / 256 = 12$.`, why: `The code is 12 times smaller than the raw image.` }
      ],
      answer: `Input $3072$; ratio $12.0\\times$.`
    },
    {
      q: `<p>Two autoencoders compress the same data. Model A: code length 8, MSE 0.01. Model B: code length 4, MSE 0.03. Which gives stronger compression, and which gives a more faithful rebuild?</p>`,
      steps: [
        { do: `Compression: B's code (4) is smaller than A's (8), so B compresses harder.`, why: `A shorter code means a higher compression ratio.` },
        { do: `Faithfulness: A's MSE (0.01) is lower than B's (0.03), so A rebuilds more accurately.`, why: `Lower reconstruction error means outputs closer to inputs.` },
        { do: `Conclude the trade-off.`, why: `B saves more space but loses more detail; A keeps more detail but stores more numbers.` }
      ],
      answer: `B compresses more; A reconstructs more faithfully.`
    }
  ]);

  /* ================================================================ */
  /* 5. VARIATIONAL AUTOENCODERS (VAE)                                */
  /* ================================================================ */
  add("mod-vae", [
    {
      q: `<p>An encoder gives mean $\\mu = 0.5$ and standard deviation $\\sigma = 0.2$ for one latent dimension. With sampled noise $\\epsilon = 1.3$, what code $z$ does the reparameterization trick produce?</p>`,
      steps: [
        { do: `Apply $z = \\mu + \\sigma \\epsilon = 0.5 + 0.2 \\times 1.3$.`, why: `The reparameterization trick builds the code by shifting and scaling the noise.` },
        { do: `Compute: $0.5 + 0.26 = 0.76$.`, why: `Same input gives a slightly different code each draw, which lets a VAE generate variety.` }
      ],
      answer: `$z = 0.76$`
    },
    {
      q: `<p>An encoder gives $\\mu = 1.0$ and $\\sigma = 0.5$. With sampled noise $\\epsilon = -2$, what code $z$ results?</p>`,
      steps: [
        { do: `Apply $z = \\mu + \\sigma \\epsilon = 1.0 + 0.5 \\times (-2)$.`, why: `The reparameterization trick: $z = \\mu + \\sigma\\epsilon$.` },
        { do: `Compute: $1.0 - 1.0 = 0$.`, why: `Negative noise can pull the code below the mean.` }
      ],
      answer: `$z = 0$`
    },
    {
      q: `<p>The reparameterization trick is $z = \\mu + \\sigma \\epsilon$. From what distribution is the noise $\\epsilon$ drawn?</p>`,
      steps: [
        { do: `Recall the trick samples a fixed standard normal.`, why: `The randomness is pushed into $\\epsilon$ so gradients can flow to $\\mu$ and $\\sigma$.` },
        { do: `State: $\\epsilon \\sim N(0, 1)$.`, why: `Shifting by $\\mu$ and scaling by $\\sigma$ then turns this into $N(\\mu, \\sigma^2)$.` }
      ],
      answer: `$\\epsilon \\sim N(0, 1)$ (standard normal).`
    },
    {
      q: `<p>If $\\epsilon = 0$ in $z = \\mu + \\sigma\\epsilon$, what does the code equal, and why does that make sense?</p>`,
      steps: [
        { do: `Substitute: $z = \\mu + \\sigma \\cdot 0 = \\mu$.`, why: `Zero noise removes the random part.` },
        { do: `Interpret: the code sits exactly at the mean.`, why: `The mean is the center of the encoded distribution; zero noise picks that center.` }
      ],
      answer: `$z = \\mu$ — the center of the distribution.`
    },
    {
      q: `<p>For a two-dimensional latent, $\\mu = [0.5, -1.0]$, $\\sigma = [0.2, 0.4]$, and noise $\\epsilon = [1.0, -0.5]$. Compute the code $z$ entry by entry using $z = \\mu + \\sigma \\odot \\epsilon$.</p>`,
      steps: [
        { do: `First entry: $0.5 + 0.2 \\times 1.0 = 0.7$.`, why: `$\\odot$ means multiply matching entries, then add the mean entry by entry.` },
        { do: `Second entry: $-1.0 + 0.4 \\times (-0.5) = -1.0 - 0.2 = -1.2$.`, why: `Each latent dimension is reparameterized independently.` }
      ],
      answer: `$z = [0.7,\\,-1.2]$`
    },
    {
      q: `<p>Why does $z = \\mu + \\sigma\\epsilon$ let gradients flow to $\\mu$? Give $\\frac{\\partial z}{\\partial \\mu}$.</p>`,
      steps: [
        { do: `Treat $\\epsilon$ as a fixed constant and differentiate $z = \\mu + \\sigma\\epsilon$ with respect to $\\mu$.`, why: `Reparameterization makes $z$ a smooth function of $\\mu$ and $\\sigma$, since the randomness lives in the constant $\\epsilon$.` },
        { do: `The derivative is $\\frac{\\partial z}{\\partial \\mu} = 1$.`, why: `A clean derivative means backpropagation can update $\\mu$, which raw sampling would block.` }
      ],
      answer: `$\\frac{\\partial z}{\\partial \\mu} = 1$`
    },
    {
      q: `<p>In $z = \\mu + \\sigma\\epsilon$ with $\\epsilon$ fixed, what is the gradient $\\frac{\\partial z}{\\partial \\sigma}$?</p>`,
      steps: [
        { do: `Differentiate $z = \\mu + \\sigma\\epsilon$ with respect to $\\sigma$, holding $\\epsilon$ fixed.`, why: `The trick keeps $z$ differentiable in the encoder outputs.` },
        { do: `Result: $\\frac{\\partial z}{\\partial \\sigma} = \\epsilon$.`, why: `The spread parameter $\\sigma$ multiplies $\\epsilon$, so its gradient is exactly $\\epsilon$.` }
      ],
      answer: `$\\frac{\\partial z}{\\partial \\sigma} = \\epsilon$`
    },
    {
      q: `<p>The VAE loss is reconstruction plus a KL term. What is the job of the KL term $D_{KL}(N(\\mu, \\sigma^2) \\,\\Vert\\, N(0,1))$?</p>`,
      steps: [
        { do: `Identify the term: it measures how far each encoded distribution is from the standard normal $N(0,1)$.`, why: `KL divergence is a number for the gap between two distributions.` },
        { do: `State its purpose: it pulls every encoded distribution toward $N(0,1)$.`, why: `This packs all the codes near one tidy bell curve so the latent space is smooth and samplable.` }
      ],
      answer: `It pulls encoded distributions toward $N(0,1)$, keeping the latent space tidy and continuous.`
    },
    {
      q: `<p>To generate a brand-new sample from a trained VAE, where do you get the code $z$, and why does this work?</p>`,
      steps: [
        { do: `Sample $z \\sim N(0, 1)$ directly (no input needed) and decode it.`, why: `The KL term trained all codes to cluster near $N(0,1)$, so a random draw lands in a meaningful region.` },
        { do: `The decoder turns $z$ into a new data point.`, why: `Because the space is continuous, this $z$ decodes to a plausible new sample.` }
      ],
      answer: `Draw $z \\sim N(0,1)$ and decode it; the KL term made that region valid.`
    },
    {
      q: `<p>For a single latent dimension, the KL divergence from $N(\\mu, \\sigma^2)$ to $N(0,1)$ is $\\frac{1}{2}(\\mu^2 + \\sigma^2 - \\ln \\sigma^2 - 1)$. Evaluate it at $\\mu = 0$, $\\sigma = 1$.</p>`,
      steps: [
        { do: `Substitute: $\\frac{1}{2}(0^2 + 1^2 - \\ln(1^2) - 1)$.`, why: `Plug the values into the closed-form KL for two normals.` },
        { do: `Simplify: $\\ln 1 = 0$, so $\\frac{1}{2}(0 + 1 - 0 - 1) = \\frac{1}{2}(0) = 0$.`, why: `KL is zero exactly when the encoded distribution already equals $N(0,1)$ — no penalty.` }
      ],
      answer: `$D_{KL} = 0$`
    },
    {
      q: `<p>Using the same KL formula $\\frac{1}{2}(\\mu^2 + \\sigma^2 - \\ln\\sigma^2 - 1)$, evaluate it at $\\mu = 2$, $\\sigma = 1$. Use $\\ln 1 = 0$.</p>`,
      steps: [
        { do: `Substitute: $\\frac{1}{2}(2^2 + 1^2 - \\ln(1) - 1)$.`, why: `Plug in the mean and spread.` },
        { do: `Compute: $\\frac{1}{2}(4 + 1 - 0 - 1) = \\frac{1}{2}(4) = 2$.`, why: `A mean far from 0 costs KL, pushing $\\mu$ back toward 0.` }
      ],
      answer: `$D_{KL} = 2$`
    },
    {
      q: `<p>Two VAE training runs report KL terms of $0.1$ and $5.0$ for one input. Which encoded distribution is closer to $N(0,1)$, and what does a very large KL hint about the latent code?</p>`,
      steps: [
        { do: `Smaller KL means closer: $0.1 < 5.0$, so the first is nearer $N(0,1)$.`, why: `KL is a distance-like gap; smaller is closer.` },
        { do: `A large KL ($5.0$) means the code sits far from the standard normal.`, why: `Its $\\mu$ or $\\sigma$ strays from $0$/$1$, so that region may not generate cleanly — the KL penalty fights this.` }
      ],
      answer: `The KL $= 0.1$ run is closer; large KL means the code drifts from $N(0,1)$.`
    },
    {
      q: `<p>A VAE samples the same input twice with $\\mu = 0.4$, $\\sigma = 0.3$, drawing $\\epsilon = 1.0$ then $\\epsilon = -1.0$. Give both codes and explain why a plain autoencoder cannot do this.</p>`,
      steps: [
        { do: `First: $z = 0.4 + 0.3(1.0) = 0.7$.`, why: `Reparameterization with positive noise.` },
        { do: `Second: $z = 0.4 + 0.3(-1.0) = 0.1$.`, why: `Negative noise gives a different code for the same input.` },
        { do: `A plain autoencoder maps each input to one fixed point, so it cannot produce this spread.`, why: `The VAE's random sampling around $\\mu$ is what gives a smooth, generative latent space.` }
      ],
      answer: `$z = 0.7$ and $z = 0.1$; a plain AE gives only one fixed code.`
    },
    {
      q: `<p>Total VAE loss is reconstruction loss plus KL. For one input: reconstruction $= 0.12$, KL $= 0.03$. What is the total loss, and which term dominates here?</p>`,
      steps: [
        { do: `Add the two terms: $0.12 + 0.03 = 0.15$.`, why: `The VAE objective sums reconstruction fidelity and the KL regularizer.` },
        { do: `Compare: $0.12 > 0.03$, so reconstruction dominates.`, why: `Here the model is mostly being pushed to rebuild the input faithfully, with a light tidy-up from KL.` }
      ],
      answer: `Total $= 0.15$; reconstruction dominates.`
    },
    {
      q: `<p>Using $D_{KL} = \\frac{1}{2}(\\mu^2 + \\sigma^2 - \\ln\\sigma^2 - 1)$ summed over 2 latent dims: dim 1 has $(\\mu, \\sigma) = (0, 1)$, dim 2 has $(\\mu, \\sigma) = (1, 1)$. Find the total KL. Use $\\ln 1 = 0$.</p>`,
      steps: [
        { do: `Dim 1: $\\frac{1}{2}(0 + 1 - 0 - 1) = 0$.`, why: `This dimension already matches $N(0,1)$.` },
        { do: `Dim 2: $\\frac{1}{2}(1 + 1 - 0 - 1) = \\frac{1}{2}(1) = 0.5$.`, why: `Its nonzero mean costs a little KL.` },
        { do: `Sum across dims: $0 + 0.5 = 0.5$.`, why: `Total KL is the sum over independent latent dimensions.` }
      ],
      answer: `Total $D_{KL} = 0.5$`
    },
    {
      q: `<p>Interpolation: latent A decodes to a smiling face, latent B to a frowning face. Why does the midpoint $z = \\frac{1}{2}(A + B)$ decode to something in between, in a VAE but not a plain autoencoder?</p>`,
      steps: [
        { do: `Compute the midpoint $z = \\frac{1}{2}(A + B)$.`, why: `Averaging two latent points gives a point halfway between them.` },
        { do: `In a VAE the KL term made the latent space continuous, so nearby points decode to similar outputs.`, why: `The midpoint lands in a trained, dense region and decodes to a plausible half-smiling face.` },
        { do: `A plain autoencoder leaves gaps between points, so the midpoint may decode to garbage.`, why: `Without the KL regularizer, the space has holes between encoded inputs.` }
      ],
      answer: `The VAE's continuous latent space makes the midpoint a valid in-between face; a plain AE has gaps.`
    },
    {
      q: `<p>Why is the KL term essential? Describe what a VAE collapses into if you remove the KL term entirely.</p>`,
      steps: [
        { do: `Remove KL: only the reconstruction term remains.`, why: `Reconstruction alone just pushes outputs to match inputs.` },
        { do: `Without KL there is nothing pulling codes toward $N(0,1)$, so the encoder can scatter codes anywhere.`, why: `The latent space stops being tidy or continuous.` },
        { do: `The model degenerates into a plain (deterministic) autoencoder.`, why: `It loses the smooth, samplable space, so you can no longer generate by drawing $z \\sim N(0,1)$.` }
      ],
      answer: `It collapses into a plain autoencoder — no smooth, samplable latent space.`
    }
  ]);

  /* ================================================================ */
  /* 6. DIFFUSION MODELS                                              */
  /* ================================================================ */
  add("mod-diffusion", [
    {
      q: `<p>A diffusion noise schedule uses $\\beta_t = 0.25$ at one step. What is the keep factor $\\sqrt{1 - \\beta_t}$?</p>`,
      steps: [
        { do: `Compute $1 - \\beta_t = 1 - 0.25 = 0.75$.`, why: `The forward step keeps a $\\sqrt{1-\\beta_t}$ fraction of the previous image.` },
        { do: `Take the root: $\\sqrt{0.75} \\approx 0.866$.`, why: `This shrinks the old image slightly to make room for fresh noise.` }
      ],
      answer: `$\\sqrt{1 - \\beta_t} \\approx 0.87$`
    },
    {
      q: `<p>With $\\beta_t = 0.5$, give both the keep factor $\\sqrt{1-\\beta_t}$ and the noise factor $\\sqrt{\\beta_t}$. Round to 3 decimals.</p>`,
      steps: [
        { do: `Keep factor: $\\sqrt{1 - 0.5} = \\sqrt{0.5} \\approx 0.707$.`, why: `It scales the previous image $x_{t-1}$.` },
        { do: `Noise factor: $\\sqrt{0.5} \\approx 0.707$.`, why: `It scales the fresh noise $\\epsilon$. At $\\beta_t = 0.5$ image and noise mix in equal measure.` }
      ],
      answer: `Both $\\approx 0.707$.`
    },
    {
      q: `<p>One forward step with $\\beta_t = 0.2$: a pixel has value $x_{t-1} = 0.9$ and the drawn noise is $\\epsilon = -1.0$. Find $x_t = \\sqrt{1-\\beta_t}\\,x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon$. Round to 3 decimals.</p>`,
      steps: [
        { do: `Keep factor: $\\sqrt{0.8} \\approx 0.894$; noise factor: $\\sqrt{0.2} \\approx 0.447$.`, why: `The forward formula uses these two square roots.` },
        { do: `Combine: $0.894 \\times 0.9 + 0.447 \\times (-1.0) = 0.805 - 0.447 = 0.358$.`, why: `The pixel shifts toward noise; after many steps it forgets its original value.` }
      ],
      answer: `$x_t \\approx 0.358$`
    },
    {
      q: `<p>At step 0 a diffusion image is clean; at step $T$ it is pure noise. If $T = 1000$, what is the image at step 1000?</p>`,
      steps: [
        { do: `Recall the endpoints: step 0 is clean data $x_0$, step $T$ is pure Gaussian noise.`, why: `The forward process gradually trades structure for noise across $T$ steps.` },
        { do: `At step $T = 1000$, the image is pure noise $x_T$.`, why: `By then all structure is gone — this is where reverse generation starts from.` }
      ],
      answer: `Pure Gaussian noise.`
    },
    {
      q: `<p>The forward step is $x_t = \\sqrt{1-\\beta_t}\\,x_{t-1} + \\sqrt{\\beta_t}\\,\\epsilon$. Assuming $x_{t-1}$ and $\\epsilon$ each have variance 1 and are independent, show $\\text{Var}(x_t) = 1$ for $\\beta_t = 0.3$.</p>`,
      steps: [
        { do: `Variance of a scaled sum of independents: $\\text{Var}(x_t) = (1-\\beta_t)\\text{Var}(x_{t-1}) + \\beta_t \\text{Var}(\\epsilon)$.`, why: `Scaling by $c$ multiplies variance by $c^2$; the two square roots squared give $1-\\beta_t$ and $\\beta_t$.` },
        { do: `Substitute: $(1-0.3)(1) + 0.3(1) = 0.7 + 0.3 = 1$.`, why: `The two coefficients sum to 1, so the variance is preserved.` }
      ],
      answer: `$\\text{Var}(x_t) = 1$ — the schedule conserves variance.`
    },
    {
      q: `<p>The training loss for the network is $\\lVert \\epsilon - \\epsilon_\\theta(x_t, t) \\rVert^2$. If the true noise is $\\epsilon = 0.5$ and the network predicts $\\epsilon_\\theta = 0.3$, what is the loss?</p>`,
      steps: [
        { do: `Subtract the prediction from the truth: $0.5 - 0.3 = 0.2$.`, why: `The network is trained to name the noise that was added.` },
        { do: `Square it: $0.2^2 = 0.04$.`, why: `Squared error penalizes how far the noise guess is from the real noise.` }
      ],
      answer: `Loss $= 0.04$`
    },
    {
      q: `<p>The network perfectly predicts the noise: true $\\epsilon = [0.5, -0.2]$, predicted $\\epsilon_\\theta = [0.5, -0.2]$. What is the loss, and what does that imply for denoising?</p>`,
      steps: [
        { do: `Differences: $0.5-0.5 = 0$ and $-0.2-(-0.2) = 0$.`, why: `A perfect prediction has zero gap.` },
        { do: `Loss: $0^2 + 0^2 = 0$.`, why: `If the network names the noise exactly, it can subtract it exactly and recover the clean signal.` }
      ],
      answer: `Loss $= 0$; perfect noise prediction means perfect denoising.`
    },
    {
      q: `<p>One forward step with $\\beta_t = 0.1$: pixel $x_{t-1} = 0.4$, noise $\\epsilon = 2.0$. Compute $x_t$. Round to 3 decimals.</p>`,
      steps: [
        { do: `Keep factor: $\\sqrt{1 - 0.1} = \\sqrt{0.9} \\approx 0.949$; noise factor: $\\sqrt{0.1} \\approx 0.316$.`, why: `Small $\\beta_t$ keeps most of the image and adds little noise.` },
        { do: `Combine: $0.949 \\times 0.4 + 0.316 \\times 2.0 = 0.380 + 0.632 = 1.012$.`, why: `Even a small $\\beta_t$ shifts the pixel when the drawn noise is large.` }
      ],
      answer: `$x_t \\approx 1.012$`
    },
    {
      q: `<p>The reverse (denoising) step recovers $x_{t-1}$ by subtracting predicted noise. If a noisy pixel is $x_t = 0.358$ and the network predicts the noise so that the clean value should be $0.9$, what was the network's job?</p>`,
      steps: [
        { do: `The network looks at $x_t = 0.358$ and predicts the noise $\\epsilon_\\theta$ that was added.`, why: `Reverse generation removes the predicted noise to step backward toward clean data.` },
        { do: `Subtracting that predicted noise recovers $x_{t-1} \\approx 0.9$.`, why: `If it names the noise correctly, the original value reappears.` }
      ],
      answer: `Predict the added noise, then subtract it to recover $\\approx 0.9$.`
    },
    {
      q: `<p>Why must $\\beta_t$ stay a small positive fraction rather than a large value like 5? Reason about the keep and noise factors.</p>`,
      steps: [
        { do: `For the factors $\\sqrt{1-\\beta_t}$ and $\\sqrt{\\beta_t}$ to be real, need $0 \\le \\beta_t \\le 1$.`, why: `A square root of a negative number is not real, so $1-\\beta_t \\ge 0$.` },
        { do: `$\\beta_t = 5$ gives $\\sqrt{1-5} = \\sqrt{-4}$, which is invalid.`, why: `The schedule is built so each step adds only a little noise; $\\beta_t$ must stay in $[0, 1]$.` }
      ],
      answer: `$\\beta_t$ must lie in $[0,1]$; otherwise the square roots are not real.`
    },
    {
      q: `<p>Two-step forward noising with constant $\\beta = 0.2$ and zero noise drawn ($\\epsilon = 0$) both times. Start at $x_0 = 1$. What is $x_2$? Round to 3 decimals.</p>`,
      steps: [
        { do: `Step 1: $x_1 = \\sqrt{0.8}\\,(1) + \\sqrt{0.2}\\,(0) = 0.894$.`, why: `With zero noise only the keep factor acts.` },
        { do: `Step 2: $x_2 = \\sqrt{0.8}\\,(0.894) = 0.894 \\times 0.894 = 0.800$.`, why: `Each step shrinks the value by the keep factor again.` }
      ],
      answer: `$x_2 \\approx 0.800$`
    },
    {
      q: `<p>The closed-form jump uses $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$, where $\\bar\\alpha_t$ is the cumulative signal kept. If $\\bar\\alpha_t = 0.64$, what are the signal factor $\\sqrt{\\bar\\alpha_t}$ and noise factor $\\sqrt{1-\\bar\\alpha_t}$?</p>`,
      steps: [
        { do: `Signal factor: $\\sqrt{0.64} = 0.8$.`, why: `$\\bar\\alpha_t$ is how much of the original $x_0$ survives to step $t$.` },
        { do: `Noise factor: $\\sqrt{1 - 0.64} = \\sqrt{0.36} = 0.6$.`, why: `The closed form lets us jump straight to any step $t$ without simulating each one.` }
      ],
      answer: `Signal $0.8$, noise $0.6$.`
    },
    {
      q: `<p>Using $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$ with $\\bar\\alpha_t = 0.64$, $x_0 = 1.0$, $\\epsilon = 0.5$, compute $x_t$.</p>`,
      steps: [
        { do: `Factors: $\\sqrt{0.64} = 0.8$, $\\sqrt{0.36} = 0.6$.`, why: `From the cumulative signal $\\bar\\alpha_t$.` },
        { do: `Combine: $0.8 \\times 1.0 + 0.6 \\times 0.5 = 0.8 + 0.3 = 1.1$.`, why: `The closed form gives $x_t$ directly from $x_0$ and one noise draw.` }
      ],
      answer: `$x_t = 1.1$`
    },
    {
      q: `<p>As $t$ grows, $\\bar\\alpha_t$ shrinks toward 0. In the closed form $x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1-\\bar\\alpha_t}\\,\\epsilon$, what does $x_t$ become when $\\bar\\alpha_t \\to 0$?</p>`,
      steps: [
        { do: `Signal factor $\\sqrt{\\bar\\alpha_t} \\to \\sqrt{0} = 0$; noise factor $\\sqrt{1-\\bar\\alpha_t} \\to \\sqrt{1} = 1$.`, why: `As $\\bar\\alpha_t \\to 0$ almost no original signal survives.` },
        { do: `So $x_t \\to 0 \\cdot x_0 + 1 \\cdot \\epsilon = \\epsilon$.`, why: `At the end of the forward process the image is just the Gaussian noise — exactly where reverse generation starts.` }
      ],
      answer: `$x_t \\to \\epsilon$ — pure noise.`
    },
    {
      q: `<p>Training batch: true noise $\\epsilon = [1, 0, -1]$, network prediction $\\epsilon_\\theta = [0.8, 0.1, -0.7]$. Compute the squared-error loss $\\lVert \\epsilon - \\epsilon_\\theta \\rVert^2$. Round to 2 decimals.</p>`,
      steps: [
        { do: `Differences: $1-0.8 = 0.2$, $0-0.1 = -0.1$, $-1-(-0.7) = -0.3$.`, why: `Loss compares predicted noise to true noise entry by entry.` },
        { do: `Square: $0.04, 0.01, 0.09$. Sum $= 0.14$.`, why: `The total squared error is what gradient descent minimizes to sharpen the noise predictor.` }
      ],
      answer: `Loss $= 0.14$`
    },
    {
      q: `<p>Why is the forward process "free" (no learning) while the reverse process needs training? Explain in two short reasons.</p>`,
      steps: [
        { do: `Forward: just add known Gaussian noise per the fixed schedule $\\beta_t$.`, why: `No parameters are involved — it is a fixed recipe, so nothing to learn.` },
        { do: `Reverse: predict and remove the noise, which requires a learned network $\\epsilon_\\theta$.`, why: `Undoing noise from a noisy image is hard and depends on the data, so the network must be trained to guess the noise.` }
      ],
      answer: `Forward adds fixed noise (no params); reverse must learn to predict the noise.`
    },
    {
      q: `<p>Full single forward step with the variance check. $\\beta_t = 0.36$, $x_{t-1} = 2.0$, $\\epsilon = -0.5$. Find $x_t$ and confirm the keep/noise coefficients' squares sum to 1. Round to 3 decimals.</p>`,
      steps: [
        { do: `Keep factor: $\\sqrt{1-0.36} = \\sqrt{0.64} = 0.8$; noise factor: $\\sqrt{0.36} = 0.6$.`, why: `The two factors come from $1-\\beta_t$ and $\\beta_t$.` },
        { do: `Compute $x_t = 0.8 \\times 2.0 + 0.6 \\times (-0.5) = 1.6 - 0.3 = 1.3$.`, why: `Blend the shrunk image with a dash of noise.` },
        { do: `Check squares: $0.8^2 + 0.6^2 = 0.64 + 0.36 = 1$.`, why: `Coefficients squared summing to 1 is exactly the variance-preserving property.` }
      ],
      answer: `$x_t = 1.3$; $0.64 + 0.36 = 1$.`
    }
  ]);

  /* ================================================================ */
  /* 7. NORMALIZING FLOWS                                             */
  /* ================================================================ */
  add("mod-normalizing-flows", [
    {
      q: `<p>A flow uses $x = g(u) = 2u$. What is the inverse transform $g^{-1}(x)$?</p>`,
      steps: [
        { do: `Solve $x = 2u$ for $u$: $u = x/2$.`, why: `A flow's transform $g$ must be invertible, so we can run any data point backward.` },
        { do: `So $g^{-1}(x) = x/2$.`, why: `The inverse maps a data point $x$ back to its base point $u$.` }
      ],
      answer: `$g^{-1}(x) = x/2$`
    },
    {
      q: `<p>A flow uses $x = g(u) = 3u$, so $g^{-1}(x) = x/3$ and the stretch factor is $\\frac{1}{3}$. If the base density at the matching $u$ is $p_u(u) = 0.3$, what is $p_x(x)$?</p>`,
      steps: [
        { do: `Apply the change of variables $p_x(x) = p_u(u)\\left|\\frac{dg^{-1}}{dx}\\right| = 0.3 \\times \\frac{1}{3}$.`, why: `The transformed density rescales the base density by the stretch factor.` },
        { do: `Compute: $0.3 / 3 = 0.1$.`, why: `Stretching by 3 thins the density to one third.` }
      ],
      answer: `$p_x(x) = 0.1$`
    },
    {
      q: `<p>For $x = g(u) = 2u$, the stretch factor is $\\left|\\frac{dg^{-1}}{dx}\\right| = \\frac{1}{2}$. At $u = 0$ the base density is $p_u(0) \\approx 0.399$. Find $p_x(0)$. Round to 3 decimals.</p>`,
      steps: [
        { do: `The data point is $x = g(0) = 0$.`, why: `Run the base point forward through $g$ to find where it lands.` },
        { do: `Apply the formula: $p_x(0) = 0.399 \\times \\frac{1}{2} = 0.199$ (rounded).`, why: `Doubling spreads the bell over twice the width, so its peak height drops by half.` }
      ],
      answer: `$p_x(0) \\approx 0.199$`
    },
    {
      q: `<p>The change-of-variables formula is $p_x(x) = p_u(g^{-1}(x))\\left|\\frac{dg^{-1}(x)}{dx}\\right|$. What does the derivative term correct for?</p>`,
      steps: [
        { do: `Identify the term as the stretch factor of $g^{-1}$.`, why: `It measures how much $g$ stretches or squeezes space near $x$.` },
        { do: `State its role: it conserves total probability (keeps the area under the density at 1).`, why: `Where $g$ spreads points apart the density thins; where it squeezes them the density piles up. The factor is bookkeeping so no probability is created or lost.` }
      ],
      answer: `It rescales the density so it still integrates to 1 (conserves probability).`
    },
    {
      q: `<p>An identity flow uses $x = g(u) = u$. What is the stretch factor $\\left|\\frac{dg^{-1}}{dx}\\right|$, and how does $p_x$ relate to $p_u$?</p>`,
      steps: [
        { do: `Inverse is $g^{-1}(x) = x$, derivative $1$, so stretch factor $= 1$.`, why: `The identity does not stretch space at all.` },
        { do: `Then $p_x(x) = p_u(u) \\times 1 = p_u(u)$.`, why: `With no stretching, the density is unchanged — the flow does nothing.` }
      ],
      answer: `Stretch factor $1$; $p_x = p_u$ (unchanged).`
    },
    {
      q: `<p>For $x = g(u) = 0.5u$ (a squeeze), $g^{-1}(x) = 2x$ and $\\frac{dg^{-1}}{dx} = 2$. If $p_u(u) = 0.4$ at the matching $u$, find $p_x(x)$.</p>`,
      steps: [
        { do: `Apply the formula: $p_x = 0.4 \\times |2| = 0.8$.`, why: `When $g$ squeezes points together (slope $<1$), the inverse derivative exceeds 1, so the density piles up.` },
        { do: `State: $p_x = 0.8$.`, why: `Halving the width doubles the peak height — total area stays 1.` }
      ],
      answer: `$p_x(x) = 0.8$`
    },
    {
      q: `<p>Take logs: the log-density formula is $\\log p_x(x) = \\log p_u(u) - \\log\\left|\\frac{dx}{du}\\right|$, where $\\frac{dx}{du} = g'(u)$. For $g(u) = 2u$, $g'(u) = 2$, and $\\log p_u(u) = -1.0$. Find $\\log p_x(x)$. Use $\\log 2 \\approx 0.693$.</p>`,
      steps: [
        { do: `Substitute: $\\log p_x = -1.0 - \\log 2 = -1.0 - 0.693$.`, why: `In log form, dividing by the stretch factor becomes subtracting its log — numerically more stable.` },
        { do: `Compute: $-1.0 - 0.693 = -1.693$.`, why: `Stretching (slope 2) lowers the log-density by $\\log 2$.` }
      ],
      answer: `$\\log p_x(x) \\approx -1.693$`
    },
    {
      q: `<p>Why does $g$ have to be invertible for a normalizing flow? Give the two things invertibility buys you.</p>`,
      steps: [
        { do: `First: to evaluate $p_x(x)$ you must run a data point backward to $u = g^{-1}(x)$.`, why: `The formula needs the matching base point, which requires the inverse.` },
        { do: `Second: to generate, you sample $u$ from the base and push it forward through $g$.`, why: `Both directions must work, so $g$ must be a one-to-one (invertible) map.` }
      ],
      answer: `Invertibility lets you (1) compute exact densities backward and (2) generate samples forward.`
    },
    {
      q: `<p>For $x = g(u) = 3u$, the slope is $g'(u) = 3$ everywhere, so $\\log|g'(u)| = \\log 3$. If $\\log p_u(u) = -0.9$, find $\\log p_x(x)$ using $\\log p_x = \\log p_u - \\log|g'(u)|$. Use $\\log 3 \\approx 1.099$.</p>`,
      steps: [
        { do: `Substitute: $\\log p_x = -0.9 - 1.099$.`, why: `Subtract the log of the stretch factor.` },
        { do: `Compute: $-0.9 - 1.099 = -1.999 \\approx -2.0$.`, why: `Stretching by 3 lowers the log-density by $\\log 3 \\approx 1.10$.` }
      ],
      answer: `$\\log p_x(x) \\approx -2.0$`
    },
    {
      q: `<p>A flow's transform has slope $g'(u) = 0.5$ at some point ($g$ squeezes there). Using $\\log p_x = \\log p_u - \\log|g'(u)|$ with $\\log p_u = -1.5$ and $\\log 0.5 \\approx -0.693$, find $\\log p_x$.</p>`,
      steps: [
        { do: `Substitute: $\\log p_x = -1.5 - (-0.693) = -1.5 + 0.693$.`, why: `Squeezing means slope $<1$, so its log is negative; subtracting a negative raises the density.` },
        { do: `Compute: $-1.5 + 0.693 = -0.807$.`, why: `Where $g$ squeezes, points pile up and the log-density rises.` }
      ],
      answer: `$\\log p_x \\approx -0.807$`
    },
    {
      q: `<p>Derive the 1-D change of variables from conservation of probability mass. Start from $p_x(x)\\,|dx| = p_u(u)\\,|du|$.</p>`,
      steps: [
        { do: `Write the relation of widths: $|dx| = |g'(u)|\\,|du|$.`, why: `The transform stretches a tiny interval by its slope $g'(u)$.` },
        { do: `Substitute and solve for $p_x$: $p_x(x) = p_u(u)\\,\\frac{|du|}{|dx|} = \\frac{p_u(u)}{|g'(u)|}$.`, why: `Dividing by the stretch keeps the probability in each interval equal across the map.` },
        { do: `Rewrite with the inverse: $u = g^{-1}(x)$ and $\\frac{1}{|g'(u)|} = \\left|\\frac{dg^{-1}}{dx}\\right|$.`, why: `This gives the standard boxed formula $p_x(x) = p_u(g^{-1}(x))\\left|\\frac{dg^{-1}}{dx}\\right|$.` }
      ],
      answer: `$p_x(x) = \\dfrac{p_u(u)}{|g'(u)|} = p_u(g^{-1}(x))\\left|\\dfrac{dg^{-1}}{dx}\\right|$`
    },
    {
      q: `<p>Why are normalizing flows able to give an <i>exact</i> data likelihood, unlike a VAE or GAN?</p>`,
      steps: [
        { do: `Because $g$ is invertible, every $x$ maps to exactly one base point $u = g^{-1}(x)$.`, why: `A unique base point means a single, well-defined density value.` },
        { do: `The change-of-variables formula then gives $p_x(x)$ exactly, with no approximation.`, why: `VAEs only bound the likelihood and GANs give none, so flows are special for exact density estimation and anomaly detection.` }
      ],
      answer: `Invertibility + change of variables yields an exact $p_x(x)$, no bound or approximation.`
    },
    {
      q: `<p>An affine flow uses $x = g(u) = au + b$ with $a = 4$, $b = 1$. Find $g^{-1}(x)$ and the stretch factor $\\left|\\frac{dg^{-1}}{dx}\\right|$.</p>`,
      steps: [
        { do: `Solve $x = 4u + 1$ for $u$: $u = (x - 1)/4$.`, why: `Invert the affine map by undoing the scale and shift.` },
        { do: `Differentiate: $\\frac{dg^{-1}}{dx} = \\frac{1}{4}$, so the stretch factor is $\\frac{1}{4}$.`, why: `The shift $b$ drops out; only the scale $a = 4$ affects how the density rescales.` }
      ],
      answer: `$g^{-1}(x) = (x-1)/4$; stretch factor $\\frac{1}{4}$.`
    },
    {
      q: `<p>Continue the affine flow $x = 4u + 1$. At base point $u = 0$, $p_u(0) \\approx 0.399$. Find the data point $x$ and $p_x(x)$. Round to 3 decimals.</p>`,
      steps: [
        { do: `Push forward: $x = 4(0) + 1 = 1$.`, why: `Run the base point through $g$ to find where it lands.` },
        { do: `Apply the formula with stretch factor $\\frac{1}{4}$: $p_x(1) = 0.399 \\times \\frac{1}{4} = 0.0998$.`, why: `Scaling by 4 spreads the bell over 4× the width, dropping its height to a quarter.` }
      ],
      answer: `$x = 1$, $p_x(1) \\approx 0.100$`
    },
    {
      q: `<p>Two stacked flows compose: $g = g_2 \\circ g_1$ with slopes $g_1'(u) = 2$ and $g_2'(\\cdot) = 3$ at the relevant points. By the chain rule the total stretch is $g'(u) = g_2' \\cdot g_1'$. Using $\\log p_x = \\log p_u - \\log|g'(u)|$ with $\\log p_u = -0.5$, find $\\log p_x$. Use $\\log 6 \\approx 1.792$.</p>`,
      steps: [
        { do: `Total slope: $g'(u) = 3 \\times 2 = 6$.`, why: `Stacking flows multiplies their stretch factors (chain rule), letting simple maps build complex shapes.` },
        { do: `Subtract its log: $\\log p_x = -0.5 - \\log 6 = -0.5 - 1.792 = -2.292$.`, why: `In log space the stacked stretches add up, so deep flows just sum the log-determinants.` }
      ],
      answer: `$\\log p_x \\approx -2.292$`
    },
    {
      q: `<p>A flow flags low-probability points as anomalies. Point A has $\\log p_x = -2$, point B has $\\log p_x = -12$. Which is the anomaly, and why use log-density?</p>`,
      steps: [
        { do: `Compare: $-12 < -2$, so B has the far lower density.`, why: `A normalizing flow gives exact densities; rare points sit in low-density regions.` },
        { do: `Flag B as the anomaly.`, why: `Log-density is used because real densities can be astronomically small; logs keep the numbers manageable and additive across stacked flows.` }
      ],
      answer: `B is the anomaly (much lower density); logs keep tiny probabilities tractable.`
    },
    {
      q: `<p>In higher dimensions the stretch factor is the absolute Jacobian determinant $|\\det J|$. A 2-D flow has Jacobian $J = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$. Find $|\\det J|$ and the log-density change $-\\log|\\det J|$. Use $\\log 6 \\approx 1.792$.</p>`,
      steps: [
        { do: `Determinant of a diagonal matrix is the product of the diagonal: $\\det J = 2 \\times 3 = 6$.`, why: `In many dimensions the single-variable derivative becomes the Jacobian determinant — the volume stretch factor.` },
        { do: `Log change: $-\\log|6| = -1.792$.`, why: `$\\log p_x = \\log p_u - \\log|\\det J|$, so stretching volume by 6 lowers the log-density by $\\log 6$.` }
      ],
      answer: `$|\\det J| = 6$; $-\\log|\\det J| \\approx -1.792$.`
    },
    {
      q: `<p>Full likelihood evaluation. A 1-D flow uses $x = g(u) = u^3$ (invertible for the values here), so $g'(u) = 3u^2$. At $u = 1$: the base log-density is $\\log p_u(1) = -1.4$. Find $\\log p_x(x)$ at the matching $x = g(1)$. Use $\\log 3 \\approx 1.099$.</p>`,
      steps: [
        { do: `Forward point: $x = g(1) = 1^3 = 1$.`, why: `Find where the base point lands.` },
        { do: `Slope at $u = 1$: $g'(1) = 3 \\cdot 1^2 = 3$, so $\\log|g'(1)| = \\log 3 \\approx 1.099$.`, why: `For a nonlinear flow the stretch varies with $u$, so evaluate $g'$ at the relevant point.` },
        { do: `Apply $\\log p_x = \\log p_u - \\log|g'| = -1.4 - 1.099 = -2.499$.`, why: `The local stretch of 3 lowers the log-density by $\\log 3$ at this point.` }
      ],
      answer: `$\\log p_x(x) \\approx -2.499$`
    }
  ]);

})();
