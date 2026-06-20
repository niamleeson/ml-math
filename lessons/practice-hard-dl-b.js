(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* =============================================================
     dl-batchnorm — HARDER: full batch-norm over a real batch,
     including mean, variance, normalize, then scale & shift.
     ============================================================= */
  add("dl-batchnorm", [
    { q:`<p>Batch-normalize the value $x_i = 8$ in the batch $[2, 4, 6, 8]$ (use $\\epsilon \\approx 0$).</p>`,
      steps:[
        {do:`Mean: $\\mu_B = \\frac{2+4+6+8}{4} = \\frac{20}{4} = 5$.`, why:`Center the batch on its mean first.`},
        {do:`Variance: gaps $-3,-1,1,3$ squared are $9,1,1,9$; $\\sigma_B^2 = \\frac{20}{4} = 5$.`, why:`Variance is the average squared gap from the mean.`},
        {do:`Spread $\\sqrt{5} \\approx 2.236$; $\\hat{x} = \\frac{8-5}{2.236} \\approx 1.34$.`, why:`Subtract the mean and divide by the spread.`}
      ],
      answer:`$\\hat{x} \\approx 1.34$` },

    { q:`<p>For the batch $[1, 2, 3, 4, 5]$, normalize $x_i = 2$ (use $\\epsilon \\approx 0$).</p>`,
      steps:[
        {do:`Mean: $\\mu_B = \\frac{1+2+3+4+5}{5} = \\frac{15}{5} = 3$.`, why:`The mean of an evenly spaced batch is its middle value.`},
        {do:`Variance: gaps $-2,-1,0,1,2$ squared sum to $4+1+0+1+4 = 10$; $\\sigma_B^2 = \\frac{10}{5} = 2$.`, why:`Average the squared gaps.`},
        {do:`Spread $\\sqrt{2} \\approx 1.414$; $\\hat{x} = \\frac{2-3}{1.414} \\approx -0.71$.`, why:`Below-mean values give a negative normalized value.`}
      ],
      answer:`$\\hat{x} \\approx -0.71$` },

    { q:`<p>Full batch norm on $x_i = 6$ from batch $[2, 4, 6]$ with $\\gamma = 3$, $\\beta = 1$ (use $\\epsilon \\approx 0$, spread $\\approx 1.633$).</p>`,
      steps:[
        {do:`Mean $\\mu_B = 4$; normalize: $\\hat{x} = \\frac{6-4}{1.633} \\approx 1.225$.`, why:`Center and scale by the batch spread.`},
        {do:`Apply scale and shift: $y = \\gamma\\,\\hat{x} + \\beta = 3 \\times 1.225 + 1$.`, why:`Batch norm re-stretches by $\\gamma$ and re-shifts by $\\beta$.`},
        {do:`Compute: $3.675 + 1 = 4.675 \\approx 4.68$.`, why:`Finish the affine step.`}
      ],
      answer:`$y \\approx 4.68$` },

    { q:`<p>Batch $[10, 20, 30, 40]$. Apply full batch norm to $x_i = 40$ with $\\gamma = 2$, $\\beta = -5$ (use $\\epsilon \\approx 0$).</p>`,
      steps:[
        {do:`Mean: $\\mu_B = \\frac{100}{4} = 25$.`, why:`Average all four values.`},
        {do:`Variance: gaps $-15,-5,5,15$ squared $225,25,25,225$ sum $500$; $\\sigma_B^2 = 125$, spread $\\sqrt{125} \\approx 11.18$.`, why:`Variance is the mean squared gap; spread is its root.`},
        {do:`Normalize: $\\hat{x} = \\frac{40-25}{11.18} \\approx 1.342$; then $y = 2(1.342) - 5 \\approx -2.32$.`, why:`Normalize, then scale and shift.`}
      ],
      answer:`$y \\approx -2.32$` },

    { q:`<p>Normalize the whole batch $[3, 6, 9, 12]$ (use $\\epsilon \\approx 0$). Give the four normalized values.</p>`,
      steps:[
        {do:`Mean: $\\mu_B = \\frac{30}{4} = 7.5$.`, why:`Center on the mean.`},
        {do:`Variance: gaps $-4.5,-1.5,1.5,4.5$ squared $20.25,2.25,2.25,20.25$ sum $45$; $\\sigma_B^2 = 11.25$, spread $\\approx 3.354$.`, why:`Average squared gaps, then take the root.`},
        {do:`Divide each gap by $3.354$: $-1.342, -0.447, 0.447, 1.342$.`, why:`Each value is rescaled by the same batch spread.`}
      ],
      answer:`$[-1.34,\\; -0.45,\\; 0.45,\\; 1.34]$` },

    { q:`<p>A normalized batch always has mean $0$ and variance $1$. After scale $\\gamma = 4$ and shift $\\beta = 10$, what mean and variance does the output have?</p>`,
      steps:[
        {do:`Output is $y = \\gamma\\,\\hat{x} + \\beta$. Mean: $\\gamma \\times 0 + \\beta = 10$.`, why:`Shifting moves the mean by $\\beta$; scaling a zero mean leaves it 0.`},
        {do:`Variance scales by $\\gamma^2$: $4^2 \\times 1 = 16$.`, why:`Multiplying values by $\\gamma$ multiplies variance by $\\gamma^2$; adding $\\beta$ does not change spread.`}
      ],
      answer:`Mean $10$, variance $16$.` },

    { q:`<p>At test time batch norm uses a running mean $\\mu = 5$ and running variance $\\sigma^2 = 9$. Normalize a single test input $x = 11$ ($\\epsilon \\approx 0$), then apply $\\gamma = 2$, $\\beta = 1$.</p>`,
      steps:[
        {do:`Spread $= \\sqrt{9} = 3$; $\\hat{x} = \\frac{11-5}{3} = 2$.`, why:`At inference we use stored running stats, not the test batch.`},
        {do:`Affine: $y = 2 \\times 2 + 1 = 5$.`, why:`Apply the learned scale and shift.`}
      ],
      answer:`$y = 5$` },

    { q:`<p>Batch $[4, 4, 10, 10]$. Normalize $x_i = 10$ (use $\\epsilon \\approx 0$).</p>`,
      steps:[
        {do:`Mean: $\\mu_B = \\frac{28}{4} = 7$.`, why:`Average the four values.`},
        {do:`Variance: gaps $-3,-3,3,3$ squared all $9$, sum $36$; $\\sigma_B^2 = 9$, spread $3$.`, why:`Average the squared gaps.`},
        {do:`Normalize: $\\hat{x} = \\frac{10-7}{3} = 1$.`, why:`Center and divide by the spread.`}
      ],
      answer:`$\\hat{x} = 1$` },

    { q:`<p>A batch-norm output is $y = \\gamma\\,\\hat{x} + \\beta = 7$ when $\\hat{x} = 2$ and $\\beta = 1$. Find the learned scale $\\gamma$.</p>`,
      steps:[
        {do:`Rearrange: $\\gamma\\,\\hat{x} = y - \\beta = 7 - 1 = 6$.`, why:`Undo the shift first.`},
        {do:`Divide by $\\hat{x}$: $\\gamma = \\frac{6}{2} = 3$.`, why:`Solve for the scale factor.`}
      ],
      answer:`$\\gamma = 3$` },

    { q:`<p>Why must batch norm keep a separate running mean and variance for test time instead of using the test batch's own stats?</p>`,
      steps:[
        {do:`At test time you may score a single example, so a "batch" mean and variance are unreliable or undefined.`, why:`One example has no meaningful spread.`},
        {do:`Using running averages from training gives stable, batch-size-independent outputs.`, why:`Predictions should not depend on which other examples happen to be scored together.`}
      ],
      answer:`So predictions stay stable and do not depend on the test batch's makeup.` }
  ]);

  /* =============================================================
     dl-early-stopping — HARDER: longer curves, train vs val gaps,
     patience bookkeeping, best-model selection.
     ============================================================= */
  add("dl-early-stopping", [
    { q:`<p>Validation error by epoch: $0.62, 0.48, 0.41, 0.39, 0.42, 0.40, 0.45$. Patience $= 2$. At which epoch do you stop, and which model do you keep?</p>`,
      steps:[
        {do:`Best so far: $0.39$ at epoch 4. Track bad epochs after it.`, why:`Patience counts consecutive epochs with no new best.`},
        {do:`Epoch 5 ($0.42$) bad (1); epoch 6 ($0.40$) still $> 0.39$ bad (2) — patience hit.`, why:`Two bad epochs in a row triggers the stop.`},
        {do:`Stop after epoch 6, restore the epoch-4 model ($0.39$).`, why:`Early stopping keeps the best checkpoint, not the last.`}
      ],
      answer:`Stop after epoch 6; keep the epoch-4 model ($0.39$).` },

    { q:`<p>Validation error: $0.70, 0.55, 0.50, 0.52, 0.49, 0.53, 0.54$. Patience $= 2$. At which epoch do you stop?</p>`,
      steps:[
        {do:`Best $0.50$ at epoch 3. Epoch 4 ($0.52$) bad (1).`, why:`Count bad epochs from the running best.`},
        {do:`Epoch 5 ($0.49$) is a NEW best — reset the counter to 0.`, why:`Any new best clears the patience count.`},
        {do:`Epoch 6 ($0.53$) bad (1), epoch 7 ($0.54$) bad (2) — patience hit, stop after epoch 7.`, why:`Two bad epochs after the epoch-5 best.`}
      ],
      answer:`Stop after epoch 7 (keep the epoch-5 model, $0.49$).` },

    { q:`<p>Training error: $0.50, 0.30, 0.20, 0.12$. Validation error: $0.52, 0.36, 0.34, 0.41$. At which epoch does validation error first start rising?</p>`,
      steps:[
        {do:`Compute gaps (val $-$ train): $0.02, 0.06, 0.14, 0.29$.`, why:`The generalization gap is validation minus training error.`},
        {do:`Validation error itself only worsens starting at epoch 4 ($0.34 \\to 0.41$).`, why:`Overfitting shows when validation error rises while training keeps falling.`}
      ],
      answer:`Epoch 4 — validation error rises while training keeps falling.` },

    { q:`<p>Validation error: $0.45, 0.45, 0.44, 0.44, 0.46$. Patience $= 1$. Where do you stop, and which model do you keep?</p>`,
      steps:[
        {do:`Best $0.44$ first reached at epoch 3. Epoch 4 ties ($0.44$): no strict improvement, bad (1).`, why:`A tie is not a strict improvement, so it counts as a bad epoch.`},
        {do:`Patience $= 1$ hit after epoch 4; the epoch-5 ($0.46$) is moot. Stop after epoch 4.`, why:`One bad epoch already reaches patience.`}
      ],
      answer:`Stop after epoch 4; keep the epoch-3 model ($0.44$).` },

    { q:`<p>Best validation error $0.30$ was at epoch 6. Training ran to epoch 20 before stopping, with patience $= 5$. How many epochs ran after the best, and could 5-patience alone explain it?</p>`,
      steps:[
        {do:`Epochs after the best: $20 - 6 = 14$.`, why:`The gap between the best epoch and the stop.`},
        {do:`With patience 5, a stop would fire 5 epochs after the best IF all were consecutive misses — that would be epoch 11, not 20.`, why:`Patience would have stopped earlier unless the counter reset on intermediate near-bests.`}
      ],
      answer:`14 epochs after the best; patience 5 alone can't explain 14, so the counter must have reset along the way.` },

    { q:`<p>Validation error: $0.40, 0.38, 0.39, 0.37, 0.41, 0.36$. Patience $= 2$. Does training stop before reaching the epoch-6 best?</p>`,
      steps:[
        {do:`Best $0.38$ (ep 2); ep 3 ($0.39$) bad (1); ep 4 ($0.37$) new best, reset.`, why:`The new best at epoch 4 resets the patience counter.`},
        {do:`Ep 5 ($0.41$) bad (1); ep 6 ($0.36$) new best before a 2nd bad epoch.`, why:`Only 1 bad epoch occurred before epoch 6 improved.`}
      ],
      answer:`No — the counter never reached 2; training continues and finds the epoch-6 best ($0.36$).` },

    { q:`<p>Two runs: A stops at epoch 8 with val error $0.31$; B trains to epoch 15 (final $0.33$) but its best checkpoint was epoch 9 at $0.30$. Which deployed model is better?</p>`,
      steps:[
        {do:`Run A deploys its best, $0.31$.`, why:`Early stopping deploys the best checkpoint.`},
        {do:`Run B deploys its epoch-9 best, $0.30$, not the final $0.33$.`, why:`The last epoch is discarded in favor of the best.`}
      ],
      answer:`Run B — its deployed (best) model is $0.30 < 0.31$.` },

    { q:`<p>Validation error: $0.60, 0.50, 0.50, 0.50, 0.55$. Patience $= 2$. When does it stop?</p>`,
      steps:[
        {do:`Best $0.50$ at epoch 2. Epoch 3 ($0.50$) ties = bad (1); epoch 4 ($0.50$) ties = bad (2).`, why:`Ties do not strictly improve, so they accumulate.`},
        {do:`Patience $= 2$ reached after epoch 4 — stop there.`, why:`Two non-improving epochs trigger the stop.`}
      ],
      answer:`Stop after epoch 4; keep the epoch-2 model.` },

    { q:`<p>A run improved validation error each epoch by exactly $0.01$ for 50 epochs. With patience $= 3$, how many epochs does it train?</p>`,
      steps:[
        {do:`Every epoch is a new best, so the bad-epoch counter never rises above 0.`, why:`Patience only triggers on consecutive non-improving epochs.`},
        {do:`Training runs the full 50 epochs (or until another stopping rule).`, why:`Continuous improvement never trips early stopping.`}
      ],
      answer:`All 50 epochs — patience never triggers.` },

    { q:`<p>Why does increasing the patience value risk wasting compute even though it can find a better model?</p>`,
      steps:[
        {do:`Larger patience waits more epochs after the best before stopping.`, why:`It tolerates more consecutive non-improving epochs.`},
        {do:`Those extra epochs may never beat the best, burning compute — but they hedge against temporary dips.`, why:`Patience trades compute for a chance at escaping a plateau.`}
      ],
      answer:`More patience trains longer past the best, costing compute even when no better model appears.` }
  ]);

  /* =============================================================
     dl-conv — HARDER: multi-position convolutions, building a
     small output feature map, strided/edge/multi-channel filters.
     ============================================================= */
  add("dl-conv", [
    { q:`<p>Convolve the $3\\times3$ image $\\begin{bmatrix}1 & 2 & 0\\\\0 & 1 & 3\\\\2 & 1 & 0\\end{bmatrix}$ with filter $\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$ (stride 1). Give the full $2\\times2$ output.</p>`,
      steps:[
        {do:`Top-left patch $\\begin{bmatrix}1&2\\\\0&1\\end{bmatrix}$: $1+1 = 2$; top-right $\\begin{bmatrix}2&0\\\\1&3\\end{bmatrix}$: $2+3 = 5$.`, why:`The identity-diagonal filter sums the two diagonal cells of each patch.`},
        {do:`Bottom-left $\\begin{bmatrix}0&1\\\\2&1\\end{bmatrix}$: $0+1 = 1$; bottom-right $\\begin{bmatrix}1&3\\\\1&0\\end{bmatrix}$: $1+0 = 1$.`, why:`Slide to the bottom row of positions.`}
      ],
      answer:`$\\begin{bmatrix}2 & 5\\\\1 & 1\\end{bmatrix}$` },

    { q:`<p>Convolve $\\begin{bmatrix}3 & 1 & 2\\\\4 & 6 & 5\\\\1 & 0 & 2\\end{bmatrix}$ with the vertical-edge filter $\\begin{bmatrix}1 & -1\\\\1 & -1\\end{bmatrix}$ (stride 1). Give the $2\\times2$ output.</p>`,
      steps:[
        {do:`Top-left $\\begin{bmatrix}3&1\\\\4&6\\end{bmatrix}$: $3-1+4-6 = 0$; top-right $\\begin{bmatrix}1&2\\\\6&5\\end{bmatrix}$: $1-2+6-5 = 0$.`, why:`The filter subtracts the right column from the left.`},
        {do:`Bottom-left $\\begin{bmatrix}4&6\\\\1&0\\end{bmatrix}$: $4-6+1-0 = -1$; bottom-right $\\begin{bmatrix}6&5\\\\0&2\\end{bmatrix}$: $6-5+0-2 = -1$.`, why:`Slide down a row and repeat.`}
      ],
      answer:`$\\begin{bmatrix}0 & 0\\\\-1 & -1\\end{bmatrix}$` },

    { q:`<p>Convolve $\\begin{bmatrix}1 & 2 & 3\\\\4 & 5 & 6\\\\7 & 8 & 9\\end{bmatrix}$ with $\\begin{bmatrix}1 & 1\\\\1 & 1\\end{bmatrix}$ (stride 1). Give the $2\\times2$ output.</p>`,
      steps:[
        {do:`Top-left $1+2+4+5 = 12$; top-right $2+3+5+6 = 16$.`, why:`An all-ones filter sums each 2×2 patch.`},
        {do:`Bottom-left $4+5+7+8 = 24$; bottom-right $5+6+8+9 = 28$.`, why:`Slide to the bottom row.`}
      ],
      answer:`$\\begin{bmatrix}12 & 16\\\\24 & 28\\end{bmatrix}$` },

    { q:`<p>Convolve the $4\\times4$ image $\\begin{bmatrix}1 & 0 & 1 & 0\\\\0 & 1 & 0 & 1\\\\1 & 0 & 1 & 0\\\\0 & 1 & 0 & 1\\end{bmatrix}$ with $\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$ at stride 2. Give the $2\\times2$ output.</p>`,
      steps:[
        {do:`Stride 2 picks four non-overlapping patches. Top-left $\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$: $1+1=2$; top-right $\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$: $1+1=2$.`, why:`Stride 2 jumps two columns/rows between patches.`},
        {do:`Bottom-left $\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$: $2$; bottom-right $\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$: $2$.`, why:`Each non-overlapping patch is identical here.`}
      ],
      answer:`$\\begin{bmatrix}2 & 2\\\\2 & 2\\end{bmatrix}$` },

    { q:`<p>Convolve $\\begin{bmatrix}2 & 1 & 0\\\\1 & 3 & 1\\\\0 & 1 & 2\\end{bmatrix}$ with the $3\\times3$ Laplacian filter $\\begin{bmatrix}0 & 1 & 0\\\\1 & -4 & 1\\\\0 & 1 & 0\\end{bmatrix}$ (stride 1). Find the single output value.</p>`,
      steps:[
        {do:`Only center and the four edge-neighbors have nonzero weight (corners weight 0).`, why:`This is an edge-detecting Laplacian filter.`},
        {do:`Sum: $1\\cdot1 + 1\\cdot1 + 1\\cdot1 + 1\\cdot1 + (-4)\\cdot3 = 4 - 12 = -8$.`, why:`Neighbors are all $1$, the center is $3$.`}
      ],
      answer:`$-8$` },

    { q:`<p>A $5\\times5$ image is convolved with a $3\\times3$ filter at stride 1, no padding. How many output positions, and how many multiply-adds total?</p>`,
      steps:[
        {do:`Output side: $5 - 3 + 1 = 3$, so $3\\times3 = 9$ positions.`, why:`Output size per side is $I - F + 1$ with stride 1.`},
        {do:`Each position does $3\\times3 = 9$ multiply-adds; total $9 \\times 9 = 81$.`, why:`Multiply per-position cost by the number of positions.`}
      ],
      answer:`$9$ positions, $81$ multiply-adds.` },

    { q:`<p>Convolve $\\begin{bmatrix}5 & 5 & 5\\\\5 & 5 & 5\\\\5 & 5 & 5\\end{bmatrix}$ with the edge filter $\\begin{bmatrix}1 & -1\\\\1 & -1\\end{bmatrix}$ (stride 1). What is every output value, and why?</p>`,
      steps:[
        {do:`Each patch is all $5$s: $5 - 5 + 5 - 5 = 0$.`, why:`The filter subtracts equal columns, giving zero on flat regions.`},
        {do:`So all four outputs are $0$.`, why:`Edge filters respond only where intensity changes.`}
      ],
      answer:`All $0$ — no edges in a flat image.` },

    { q:`<p>Convolve $\\begin{bmatrix}0 & 0 & 9\\\\0 & 0 & 9\\\\0 & 0 & 9\\end{bmatrix}$ with $\\begin{bmatrix}1 & -1\\\\1 & -1\\end{bmatrix}$ (stride 1). Give the $2\\times2$ output and interpret it.</p>`,
      steps:[
        {do:`Top-left $\\begin{bmatrix}0&0\\\\0&0\\end{bmatrix}$: $0$; top-right $\\begin{bmatrix}0&9\\\\0&9\\end{bmatrix}$: $0-9+0-9 = -18$.`, why:`The right pair of positions straddles the dark-to-bright edge.`},
        {do:`Bottom-left $0$; bottom-right $\\begin{bmatrix}0&9\\\\0&9\\end{bmatrix}$: $-18$.`, why:`The same vertical edge appears in both right positions.`}
      ],
      answer:`$\\begin{bmatrix}0 & -18\\\\0 & -18\\end{bmatrix}$ — a strong vertical edge on the right.` },

    { q:`<p>An RGB patch has R$=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$, G$=\\begin{bmatrix}2&1\\\\1&0\\end{bmatrix}$, B$=\\begin{bmatrix}0&1\\\\1&1\\end{bmatrix}$. A $2\\times2\\times3$ filter is all-ones across every channel. Find the single output (before bias).</p>`,
      steps:[
        {do:`Sum each channel: R $=1+0+0+1=2$, G $=2+1+1+0=4$, B $=0+1+1+1=3$.`, why:`A 3-D filter convolves each channel, then adds across channels.`},
        {do:`Add the channel sums: $2 + 4 + 3 = 9$.`, why:`A multi-channel conv produces one number per position.`}
      ],
      answer:`$9$` },

    { q:`<p>Why does a multi-channel ($C > 1$) convolution still produce a single number per output position, not $C$ numbers?</p>`,
      steps:[
        {do:`The filter has its own slice for each input channel.`, why:`A $F\\times F\\times C$ filter spans all channels.`},
        {do:`Each channel's element-wise products are all summed together into one value.`, why:`Summing across channels fuses them into a single response.`}
      ],
      answer:`The per-channel products are summed across channels into one number.` }
  ]);

  /* =============================================================
     dl-pooling — HARDER: bigger grids, overlapping strides,
     output-size with stride, max vs average comparisons.
     ============================================================= */
  add("dl-pooling", [
    { q:`<p>Max-pool the $4\\times4$ map $\\begin{bmatrix}2 & 8 & 1 & 0\\\\5 & 3 & 7 & 4\\\\9 & 1 & 6 & 2\\\\0 & 4 & 3 & 8\\end{bmatrix}$ with a $2\\times2$ window, stride 2. Give the full output.</p>`,
      steps:[
        {do:`Top-left $\\max(2,8,5,3)=8$; top-right $\\max(1,0,7,4)=7$.`, why:`Non-overlapping 2×2 blocks across the top.`},
        {do:`Bottom-left $\\max(9,1,0,4)=9$; bottom-right $\\max(6,2,3,8)=8$.`, why:`Bottom row of blocks.`}
      ],
      answer:`$\\begin{bmatrix}8 & 7\\\\9 & 8\\end{bmatrix}$` },

    { q:`<p>Average-pool the same map $\\begin{bmatrix}2 & 8 & 1 & 0\\\\5 & 3 & 7 & 4\\\\9 & 1 & 6 & 2\\\\0 & 4 & 3 & 8\\end{bmatrix}$ with a $2\\times2$ window, stride 2. Give the full output.</p>`,
      steps:[
        {do:`Top-left $\\frac{2+8+5+3}{4}=\\frac{18}{4}=4.5$; top-right $\\frac{1+0+7+4}{4}=\\frac{12}{4}=3$.`, why:`Average each non-overlapping block.`},
        {do:`Bottom-left $\\frac{9+1+0+4}{4}=\\frac{14}{4}=3.5$; bottom-right $\\frac{6+2+3+8}{4}=\\frac{19}{4}=4.75$.`, why:`Continue across the bottom blocks.`}
      ],
      answer:`$\\begin{bmatrix}4.5 & 3\\\\3.5 & 4.75\\end{bmatrix}$` },

    { q:`<p>A $7\\times7$ feature map is max-pooled with a $3\\times3$ window at stride 2 (no padding). What is the output size?</p>`,
      steps:[
        {do:`Use $O = \\frac{I - F}{S} + 1 = \\frac{7 - 3}{2} + 1$.`, why:`Pooling output size uses the same floor formula as conv (with $P=0$).`},
        {do:`Simplify: $\\frac{4}{2} + 1 = 2 + 1 = 3$.`, why:`Divide by the stride, then add 1.`}
      ],
      answer:`$3\\times3$` },

    { q:`<p>Apply $2\\times2$ max pooling at stride 1 (overlapping) to $\\begin{bmatrix}1 & 3 & 2\\\\4 & 6 & 5\\\\7 & 8 & 0\\end{bmatrix}$. Give the $2\\times2$ output.</p>`,
      steps:[
        {do:`Stride 1 gives $3-2+1 = 2$ positions per side. Top-left $\\max(1,3,4,6)=6$; top-right $\\max(3,2,6,5)=6$.`, why:`Overlapping windows slide one cell at a time.`},
        {do:`Bottom-left $\\max(4,6,7,8)=8$; bottom-right $\\max(6,5,8,0)=8$.`, why:`Slide down one row.`}
      ],
      answer:`$\\begin{bmatrix}6 & 6\\\\8 & 8\\end{bmatrix}$` },

    { q:`<p>A $6\\times6$ feature map is pooled with a $2\\times2$ window at stride 2. How many output values are there in total?</p>`,
      steps:[
        {do:`Each side: $\\frac{6-2}{2} + 1 = \\frac{4}{2} + 1 = 3$.`, why:`Floor formula for pooling output size.`},
        {do:`Total: $3 \\times 3 = 9$ values.`, why:`Width times height of the output map.`}
      ],
      answer:`$9$ values (a $3\\times3$ map).` },

    { q:`<p>Max-pool the $3\\times3$ window $\\begin{bmatrix}1 & 2 & 9\\\\3 & 0 & 4\\\\5 & 6 & 7\\end{bmatrix}$ and average-pool it. How much larger is the max than the average?</p>`,
      steps:[
        {do:`Max $= 9$. Sum $= 1+2+9+3+0+4+5+6+7 = 37$; average $= \\frac{37}{9} \\approx 4.11$.`, why:`Max keeps the peak; average smooths over all 9 cells.`},
        {do:`Difference: $9 - 4.11 = 4.89$.`, why:`Compare the two pooling results.`}
      ],
      answer:`$\\approx 4.89$` },

    { q:`<p>Global average pooling reduces a $4\\times4$ feature map to a single number. For $\\begin{bmatrix}1 & 2 & 3 & 4\\\\4 & 3 & 2 & 1\\\\1 & 2 & 3 & 4\\\\4 & 3 & 2 & 1\\end{bmatrix}$, find that number.</p>`,
      steps:[
        {do:`Each row sums to $1+2+3+4 = 10$; four rows give $40$.`, why:`Global average pooling averages every cell in the map.`},
        {do:`Divide by the $16$ cells: $\\frac{40}{16} = 2.5$.`, why:`There are 16 values in a 4×4 map.`}
      ],
      answer:`$2.5$` },

    { q:`<p>Apply $2\\times2$ max pooling (stride 2) to a $4\\times4$ map where every value is $7$. Then average-pool it. Compare the two results.</p>`,
      steps:[
        {do:`Every window is all $7$s, so max $= 7$ for each block.`, why:`The maximum of identical values is that value.`},
        {do:`Average is also $7$ per block. Both pooled maps are $\\begin{bmatrix}7&7\\\\7&7\\end{bmatrix}$.`, why:`On a constant region, max and average agree.`}
      ],
      answer:`Identical — both give $\\begin{bmatrix}7 & 7\\\\7 & 7\\end{bmatrix}$.` },

    { q:`<p>A $28\\times28$ map goes through two pooling layers, each $2\\times2$ stride 2. What is the final spatial size?</p>`,
      steps:[
        {do:`First pool: $\\frac{28}{2} = 14$, giving $14\\times14$.`, why:`Each 2×2 stride-2 pool halves both dimensions.`},
        {do:`Second pool: $\\frac{14}{2} = 7$, giving $7\\times7$.`, why:`Apply the halving again.`}
      ],
      answer:`$7\\times7$` },

    { q:`<p>Why is max pooling more common than average pooling for detecting whether a feature is present?</p>`,
      steps:[
        {do:`Max keeps the single strongest activation in a window.`, why:`A strong response anywhere in the region survives.`},
        {do:`Average dilutes a strong response by mixing it with weak ones.`, why:`Presence is better signalled by the peak than the mean.`}
      ],
      answer:`Max preserves the strongest activation; average can wash it out.` }
  ]);

  /* =============================================================
     dl-conv-hyperparams — HARDER: dilation, multi-layer chains,
     same-padding solving, non-square inputs, solving for F.
     ============================================================= */
  add("dl-conv-hyperparams", [
    { q:`<p>Input $I = 224$, filter $F = 11$, padding $P = 0$, stride $S = 4$. Find the output size $O$.</p>`,
      steps:[
        {do:`Plug into $O = \\frac{I - F + 2P}{S} + 1$: $O = \\frac{224 - 11 + 0}{4} + 1$.`, why:`This is the AlexNet first layer.`},
        {do:`Simplify: $\\frac{213}{4} + 1 = 53.25 + 1 = 54.25$, floor to $54$.`, why:`Only whole filter positions count, so floor the result.`}
      ],
      answer:`$54\\times54$` },

    { q:`<p>A dilated conv has effective filter size $F_{\\text{eff}} = F + (F-1)(d-1)$. For $F = 3$, dilation $d = 2$, find $F_{\\text{eff}}$, then the output for $I = 7$, $P = 0$, $S = 1$.</p>`,
      steps:[
        {do:`Effective size: $F_{\\text{eff}} = 3 + (3-1)(2-1) = 3 + 2 = 5$.`, why:`Dilation spreads the filter taps apart, enlarging its reach.`},
        {do:`Output: $O = \\frac{7 - 5 + 0}{1} + 1 = 2 + 1 = 3$.`, why:`Use $F_{\\text{eff}}$ in place of $F$ in the output formula.`}
      ],
      answer:`$F_{\\text{eff}} = 5$, output $3\\times3$.` },

    { q:`<p>Two conv layers in a row: input $32$. Layer 1: $F=3, P=0, S=1$. Layer 2: $F=3, P=0, S=1$. Find the size after both layers.</p>`,
      steps:[
        {do:`After layer 1: $\\frac{32-3+0}{1}+1 = 29+1 = 30$.`, why:`Each 3×3 valid conv trims 2 off each side.`},
        {do:`After layer 2: $\\frac{30-3+0}{1}+1 = 27+1 = 28$.`, why:`Feed the 30×30 map through the second layer.`}
      ],
      answer:`$28\\times28$` },

    { q:`<p>A non-square input is $H\\times W = 10\\times20$. Filter $F = 3$, $P = 1$, $S = 2$. Find the output height and width.</p>`,
      steps:[
        {do:`Height: $\\frac{10 - 3 + 2}{2} + 1 = \\frac{9}{2} + 1 = 4.5 + 1 = 5.5$, floor $5$.`, why:`Apply the formula independently to each dimension.`},
        {do:`Width: $\\frac{20 - 3 + 2}{2} + 1 = \\frac{19}{2} + 1 = 9.5 + 1 = 10.5$, floor $10$.`, why:`Width uses $W=20$ in the same formula.`}
      ],
      answer:`$5\\times10$` },

    { q:`<p>What padding $P$ gives "same" output ($O = I$) for $F = 5$, $S = 1$?</p>`,
      steps:[
        {do:`Set $I = \\frac{I - 5 + 2P}{1} + 1$, so $0 = -5 + 2P + 1$.`, why:`Same padding keeps the spatial size unchanged.`},
        {do:`Solve: $2P = 4$, $P = 2$.`, why:`General rule: $P = \\frac{F-1}{2}$ for odd $F$, stride 1.`}
      ],
      answer:`$P = 2$` },

    { q:`<p>Input $I = 13$, filter $F = 6$, padding $P = 2$, stride $S = 3$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{13 - 6 + 2\\times2}{3} + 1 = \\frac{11}{3} + 1$.`, why:`Add $2P = 4$ in the numerator.`},
        {do:`Simplify: $3.67 + 1 = 4.67$, floor to $4$.`, why:`Floor the non-whole result.`}
      ],
      answer:`$4\\times4$` },

    { q:`<p>A conv ($F=3, P=1, S=1$) keeps size, then a $2\\times2$ stride-2 pool follows. Starting from $32\\times32$, what is the size after both?</p>`,
      steps:[
        {do:`Conv: $\\frac{32-3+2}{1}+1 = 31+1 = 32$ (unchanged, same padding).`, why:`$P=1$ with $F=3$, $S=1$ preserves spatial size.`},
        {do:`Pool: $\\frac{32}{2} = 16$.`, why:`A 2×2 stride-2 pool halves each dimension.`}
      ],
      answer:`$16\\times16$` },

    { q:`<p>Given output $O = 5$, input $I = 11$, padding $P = 0$, stride $S = 2$, solve for the filter size $F$.</p>`,
      steps:[
        {do:`From $O = \\frac{I - F + 2P}{S} + 1$: $5 = \\frac{11 - F}{2} + 1$, so $\\frac{11-F}{2} = 4$.`, why:`Rearrange to isolate the filter term.`},
        {do:`Then $11 - F = 8$, so $F = 3$.`, why:`Solve the linear equation for $F$.`}
      ],
      answer:`$F = 3$` },

    { q:`<p>A $1\\times1$ conv with $S = 1$, $P = 0$ is applied to a $28\\times28\\times64$ volume using $32$ filters. What is the output spatial size, and does the depth change?</p>`,
      steps:[
        {do:`Spatial: $O = \\frac{28 - 1 + 0}{1} + 1 = 27 + 1 = 28$, so $28\\times28$ stays.`, why:`A 1×1 filter at stride 1 never shrinks the spatial dimensions.`},
        {do:`Depth becomes the number of filters: $32$ (down from 64).`, why:`1×1 convs mix channels and reset depth to $K$.`}
      ],
      answer:`$28\\times28$, depth changes from $64$ to $32$.` },

    { q:`<p>Why does a strided conv ($S > 1$) sometimes need the floor, while $S = 1$ with same padding never does?</p>`,
      steps:[
        {do:`With $S>1$, $\\frac{I-F+2P}{S}$ may not divide evenly, leaving a fractional position.`, why:`Partial filter positions at the edge are dropped (floored).`},
        {do:`With $S=1$ and same padding, the numerator is a multiple of $1$, always an integer.`, why:`Dividing by 1 can never produce a fraction.`}
      ],
      answer:`Stride $>1$ can leave a partial last step (floored); stride 1 always divides evenly.` }
  ]);

  /* =============================================================
     dl-cnn-params — HARDER: multi-layer totals, FC layers,
     comparisons, pooling has zero params, solving for F.
     ============================================================= */
  add("dl-cnn-params", [
    { q:`<p>A CNN block: conv1 ($K=16, F=3, C=3$) then conv2 ($K=32, F=3, C=16$). Find the total parameters across both conv layers.</p>`,
      steps:[
        {do:`Conv1: $(3\\times3\\times3 + 1)\\times16 = (27+1)\\times16 = 448$.`, why:`Conv1 sees the 3-channel input.`},
        {do:`Conv2: $(3\\times3\\times16 + 1)\\times32 = 145\\times32 = 4640$. Total $448 + 4640 = 5088$.`, why:`Conv2's input depth is conv1's $K=16$.`}
      ],
      answer:`$5088$` },

    { q:`<p>A conv layer has $K = 64$ filters, $F = 3$, over $C = 32$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $3\\times3\\times32 = 288$.`, why:`Each filter spans all 32 input channels.`},
        {do:`Add bias, times $K$: $(288 + 1)\\times64 = 289\\times64 = 18{,}496$.`, why:`64 filters, each with one bias.`}
      ],
      answer:`$18{,}496$` },

    { q:`<p>A flatten then fully-connected layer maps $7\\times7\\times64 = 3136$ inputs to $10$ outputs. How many parameters (weights + biases)?</p>`,
      steps:[
        {do:`Weights: $3136 \\times 10 = 31{,}360$.`, why:`A dense layer connects every input to every output.`},
        {do:`Biases: one per output, $10$. Total $31{,}360 + 10 = 31{,}370$.`, why:`FC layers add one bias per output neuron.`}
      ],
      answer:`$31{,}370$` },

    { q:`<p>How many parameters does a $2\\times2$ stride-2 max-pooling layer have?</p>`,
      steps:[
        {do:`Pooling just takes a max or average of fixed cells.`, why:`There are no weights to learn in pooling.`},
        {do:`So it has $0$ parameters.`, why:`Pooling is a fixed operation with no learnable values.`}
      ],
      answer:`$0$` },

    { q:`<p>Compare parameter counts: a conv ($K=32, F=3, C=3$) versus a dense layer connecting a $32\\times32\\times3$ image directly to $32$ outputs. Which is smaller?</p>`,
      steps:[
        {do:`Conv: $(3\\times3\\times3 + 1)\\times32 = 28\\times32 = 896$.`, why:`Weight sharing makes conv independent of image size.`},
        {do:`Dense: $(32\\times32\\times3)\\times32 + 32 = 3072\\times32 + 32 = 98{,}336$.`, why:`A dense layer connects every pixel to every output.`}
      ],
      answer:`The conv layer ($896$ vs $98{,}336$) — weight sharing is far cheaper.` },

    { q:`<p>A depthwise conv applies one $F=3$ filter per channel separately over $C = 16$ channels (no cross-channel mixing). How many parameters (one bias per channel)?</p>`,
      steps:[
        {do:`Each channel gets its own $3\\times3$ filter: $3\\times3 = 9$ weights, plus $1$ bias $= 10$.`, why:`Depthwise convs do not span across channels.`},
        {do:`Across $16$ channels: $10 \\times 16 = 160$.`, why:`One independent filter per channel.`}
      ],
      answer:`$160$` },

    { q:`<p>Total params for a 3-layer conv stack: L1 $(K=8,F=3,C=1)$, L2 $(K=16,F=3,C=8)$, L3 $(K=16,F=1,C=16)$.</p>`,
      steps:[
        {do:`L1: $(9\\times1 + 1)\\times8 = 10\\times8 = 80$. L2: $(3\\times3\\times8 + 1)\\times16 = 73\\times16 = 1168$.`, why:`Each layer's $C$ is the previous layer's $K$.`},
        {do:`L3: $(1\\times1\\times16 + 1)\\times16 = 17\\times16 = 272$. Total $80 + 1168 + 272 = 1520$.`, why:`Add all three layer counts.`}
      ],
      answer:`$1520$` },

    { q:`<p>A conv layer has $2432$ parameters with $K = 32$ filters over $C = 3$ channels. Find the square filter size $F$.</p>`,
      steps:[
        {do:`From $(F^2 \\cdot C + 1)\\cdot K = 2432$: $(3F^2 + 1)\\times32 = 2432$, so $3F^2 + 1 = 76$.`, why:`Divide out $K = 32$.`},
        {do:`Then $3F^2 = 75$, $F^2 = 25$, $F = 5$.`, why:`Solve for the square filter size.`}
      ],
      answer:`$F = 5$` },

    { q:`<p>An inception-style layer runs three parallel convs on a $C=32$ input: $(K=16,F=1)$, $(K=32,F=3)$, and $(K=8,F=5)$. Find the total parameters.</p>`,
      steps:[
        {do:`$1\\times1$: $(1\\times1\\times32 + 1)\\times16 = 33\\times16 = 528$. $3\\times3$: $(9\\times32 + 1)\\times32 = 289\\times32 = 9248$.`, why:`Each branch is an independent conv over the same input.`},
        {do:`$5\\times5$: $(25\\times32 + 1)\\times8 = 801\\times8 = 6408$. Total $528 + 9248 + 6408 = 16{,}184$.`, why:`Sum the three parallel branches.`}
      ],
      answer:`$16{,}184$` },

    { q:`<p>Why does adding more pooling layers reduce a CNN's total parameter count even though pooling has no parameters of its own?</p>`,
      steps:[
        {do:`Pooling shrinks the spatial size, so the flattened vector feeding the dense layer is smaller.`, why:`Dense-layer params scale with the number of inputs.`},
        {do:`Fewer dense inputs means far fewer dense weights overall.`, why:`The savings come from the downstream FC layer, not pooling itself.`}
      ],
      answer:`Pooling shrinks the feature map, so the downstream dense layer needs far fewer weights.` }
  ]);

  /* =============================================================
     dl-object-detection — HARDER: IoU from coordinates,
     non-max suppression, thresholding multiple boxes.
     ============================================================= */
  add("dl-object-detection", [
    { q:`<p>Box A spans $x\\in[0,4], y\\in[0,4]$; Box B spans $x\\in[2,6], y\\in[1,5]$. Find the IoU.</p>`,
      steps:[
        {do:`Intersection: x-overlap $[2,4]$ width $2$; y-overlap $[1,4]$ height $3$; area $= 2\\times3 = 6$.`, why:`Overlap is the rectangle where both boxes meet.`},
        {do:`Areas: A $=16$, B $=4\\times4=16$; union $= 16+16-6 = 26$; IoU $= \\frac{6}{26} \\approx 0.23$.`, why:`Union subtracts the double-counted overlap.`}
      ],
      answer:`$\\approx 0.23$` },

    { q:`<p>Box A spans $x\\in[1,5], y\\in[1,5]$; Box B spans $x\\in[3,7], y\\in[3,7]$. Find the IoU.</p>`,
      steps:[
        {do:`x-overlap $[3,5]$ width $2$; y-overlap $[3,5]$ height $2$; overlap area $= 4$.`, why:`Both boxes are $4\\times4 = 16$, meeting in a 2×2 corner.`},
        {do:`Union $= 16 + 16 - 4 = 28$; IoU $= \\frac{4}{28} = \\frac{1}{7} \\approx 0.14$.`, why:`Apply the IoU formula.`}
      ],
      answer:`$\\approx 0.14$` },

    { q:`<p>Non-max suppression: three boxes for one object have confidences $0.9, 0.75, 0.6$. Each lower box has IoU $> 0.5$ with the top box. With NMS threshold $0.5$, which boxes survive?</p>`,
      steps:[
        {do:`Keep the highest-confidence box ($0.9$).`, why:`NMS always keeps the most confident box first.`},
        {do:`The other two have IoU $> 0.5$ with it, so they are suppressed.`, why:`Boxes overlapping the kept box above the threshold are removed as duplicates.`}
      ],
      answer:`Only the $0.9$ box survives.` },

    { q:`<p>NMS over four boxes, confidences $0.95, 0.9, 0.85, 0.8$. IoUs with the $0.95$ box: $0.6, 0.3, 0.7$. Threshold $0.5$. After processing the top box, which remain?</p>`,
      steps:[
        {do:`Keep $0.95$. Suppress boxes with IoU $> 0.5$: the $0.9$ (IoU $0.6$) and $0.8$ (IoU $0.7$) go.`, why:`High overlap means same object — discard.`},
        {do:`The $0.85$ box (IoU $0.3 < 0.5$) survives to the next round.`, why:`Low overlap means a likely different object, kept for further NMS.`}
      ],
      answer:`The $0.95$ and $0.85$ boxes remain.` },

    { q:`<p>A predicted box $[0,6]\\times[0,2]$ (area $12$) lies fully inside ground truth $[0,6]\\times[0,4]$ (area $24$). Find the IoU.</p>`,
      steps:[
        {do:`Overlap is the whole prediction: $12$.`, why:`When one box is inside the other, overlap equals the smaller box.`},
        {do:`Union $= 12 + 24 - 12 = 24$; IoU $= \\frac{12}{24} = 0.5$.`, why:`Union equals the larger box here.`}
      ],
      answer:`$0.5$` },

    { q:`<p>A detection counts as a true positive if IoU $\\ge 0.5$. A box has overlap $18$ with the truth; predicted area $30$, truth area $24$. True positive?</p>`,
      steps:[
        {do:`Union $= 30 + 24 - 18 = 36$; IoU $= \\frac{18}{36} = 0.5$.`, why:`Compute IoU from the areas.`},
        {do:`$0.5 \\ge 0.5$, so it qualifies.`, why:`At or above the threshold counts as a true positive.`}
      ],
      answer:`Yes — IoU $= 0.5$ meets the threshold.` },

    { q:`<p>Two boxes $A=[0,2]\\times[0,2]$ and $B=[3,5]\\times[3,5]$ do not touch. Find their IoU.</p>`,
      steps:[
        {do:`x-ranges $[0,2]$ and $[3,5]$ do not overlap, so intersection $= 0$.`, why:`If either axis has no overlap, the boxes share no area.`},
        {do:`IoU $= \\frac{0}{\\text{union}} = 0$.`, why:`Zero overlap gives zero IoU.`}
      ],
      answer:`$0$` },

    { q:`<p>A grid cell predicts a box with center $(3.5, 2.5)$, width $4$, height $2$. What are its corner ranges (min/max x and y)?</p>`,
      steps:[
        {do:`x spans center $\\pm \\frac{w}{2} = 3.5 \\pm 2 = [1.5, 5.5]$.`, why:`Half the width on each side of the center.`},
        {do:`y spans center $\\pm \\frac{h}{2} = 2.5 \\pm 1 = [1.5, 3.5]$.`, why:`Half the height on each side of the center.`}
      ],
      answer:`$x\\in[1.5, 5.5]$, $y\\in[1.5, 3.5]$.` },

    { q:`<p>Lowering the NMS IoU threshold from $0.5$ to $0.3$ — does it suppress more or fewer overlapping boxes?</p>`,
      steps:[
        {do:`A lower threshold flags boxes as duplicates at smaller overlaps.`, why:`More boxes now exceed the threshold against the kept box.`},
        {do:`So more boxes get suppressed.`, why:`The suppression net is wider.`}
      ],
      answer:`More boxes are suppressed (the overlap rule becomes stricter).` },

    { q:`<p>Why does object detection use IoU rather than just checking if box centers are close?</p>`,
      steps:[
        {do:`Two boxes can share a center yet differ wildly in size and barely overlap.`, why:`Center distance ignores box dimensions.`},
        {do:`IoU measures actual area agreement, capturing both position and size.`, why:`It rewards boxes that truly cover the same region.`}
      ],
      answer:`IoU captures size and position together; center distance ignores box extent.` }
  ]);

  /* =============================================================
     dl-face-recognition — HARDER: triplet loss summed over
     triplets, solving for margins/distances, verification.
     ============================================================= */
  add("dl-face-recognition", [
    { q:`<p>Two triplets give inside-max values $0.1 - 0.5 + 0.3 = -0.1$ and $0.4 - 0.4 + 0.3 = 0.3$ (margin $\\alpha = 0.3$). Find the total triplet loss.</p>`,
      steps:[
        {do:`First triplet: $\\max(-0.1, 0) = 0$.`, why:`A negative value means that triplet already satisfies the margin.`},
        {do:`Second: $\\max(0.3, 0) = 0.3$. Total $= 0 + 0.3 = 0.3$.`, why:`Sum the per-triplet losses.`}
      ],
      answer:`$0.3$` },

    { q:`<p>Encoding distances use squared Euclidean. If $d(A,P) = 0.16$ and $d(A,N) = 0.81$ with $\\alpha = 0.2$, find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $d(A,P) - d(A,N) + \\alpha = 0.16 - 0.81 + 0.2 = -0.45$.`, why:`Use the squared distances directly as $d$.`},
        {do:`Loss $= \\max(-0.45, 0) = 0$.`, why:`The negative is far enough — no penalty.`}
      ],
      answer:`$0$` },

    { q:`<p>$d(A,P) = 0.5$, $d(A,N) = 0.6$, margin $\\alpha = 0.4$. Find the loss, then the smallest $d(A,N)$ that would make the loss $0$.</p>`,
      steps:[
        {do:`Inside: $0.5 - 0.6 + 0.4 = 0.3$; loss $= \\max(0.3, 0) = 0.3$.`, why:`The margin demands a gap bigger than 0.1.`},
        {do:`Loss is 0 when $d(A,N) \\ge d(A,P) + \\alpha = 0.5 + 0.4 = 0.9$.`, why:`The negative must beat the positive by the full margin.`}
      ],
      answer:`Loss $= 0.3$; need $d(A,N) \\ge 0.9$.` },

    { q:`<p>Three triplets have inside-max values $0.2, -0.3, 0.5$. Find the average triplet loss.</p>`,
      steps:[
        {do:`Clip each: $\\max(0.2,0)=0.2$, $\\max(-0.3,0)=0$, $\\max(0.5,0)=0.5$.`, why:`Each triplet contributes only its non-negative part.`},
        {do:`Average: $\\frac{0.2 + 0 + 0.5}{3} = \\frac{0.7}{3} \\approx 0.23$.`, why:`Average the clipped losses.`}
      ],
      answer:`$\\approx 0.23$` },

    { q:`<p>A hard triplet has $d(A,P) = 0.7$ and $d(A,N) = 0.5$ (the negative is closer than the positive). With $\\alpha = 0.2$, find the loss.</p>`,
      steps:[
        {do:`Inside: $0.7 - 0.5 + 0.2 = 0.4$.`, why:`The wrong ordering plus the margin makes a large positive.`},
        {do:`Loss $= \\max(0.4, 0) = 0.4$.`, why:`Hard triplets give the biggest, most useful gradients.`}
      ],
      answer:`$0.4$` },

    { q:`<p>For verification, two faces match if their encoding distance is below threshold $\\tau = 0.6$. Distances: pair 1 $= 0.45$, pair 2 $= 0.72$. Which pairs are accepted as the same person?</p>`,
      steps:[
        {do:`Pair 1: $0.45 < 0.6$, accept.`, why:`Distances under the threshold mean a likely match.`},
        {do:`Pair 2: $0.72 > 0.6$, reject.`, why:`Larger distance means different people.`}
      ],
      answer:`Pair 1 accepted, pair 2 rejected.` },

    { q:`<p>$d(A,P) = 0.3$, $d(A,N) = 0.35$, margin $\\alpha = 0.2$ (loss $0.15$). By how much must $d(A,N)$ increase to drive the loss to $0$?</p>`,
      steps:[
        {do:`Need $d(A,N) \\ge d(A,P) + \\alpha = 0.3 + 0.2 = 0.5$.`, why:`The zero-loss condition sets the target distance.`},
        {do:`Increase needed: $0.5 - 0.35 = 0.15$.`, why:`The current $d(A,N)$ is 0.35.`}
      ],
      answer:`Increase $d(A,N)$ by $0.15$ (to $0.5$).` },

    { q:`<p>Why is hard-triplet mining (choosing triplets where the negative is close to the anchor) more efficient for training than random triplets?</p>`,
      steps:[
        {do:`Random triplets often already satisfy the margin, giving loss $0$ and no gradient.`, why:`Easy triplets teach the network nothing.`},
        {do:`Hard triplets violate the margin, producing nonzero loss and useful updates.`, why:`Gradients flow only from margin-violating triplets.`}
      ],
      answer:`Hard triplets violate the margin, so they produce nonzero loss and real gradients.` },

    { q:`<p>Total batch loss is $\\sum \\max(d(A,P) - d(A,N) + \\alpha, 0)$. If every triplet's inside value is exactly $0$, what is the loss and gradient signal?</p>`,
      steps:[
        {do:`Each $\\max(0, 0) = 0$, so total loss $= 0$.`, why:`All triplets exactly meet the margin.`},
        {do:`Zero loss means near-zero gradient, so these triplets stop driving learning — but only that the margin is met, not perfect separation.`, why:`Loss reaching 0 only means the margin condition holds.`}
      ],
      answer:`Loss $0$, near-zero gradient; the margin is just met (not a guarantee of perfection).` },

    { q:`<p>Increasing the margin $\\alpha$ from $0.2$ to $0.5$ — does it make the loss easier or harder to drive to $0$, and what is the intended effect?</p>`,
      steps:[
        {do:`Zero loss needs $d(A,N) \\ge d(A,P) + \\alpha$; a bigger $\\alpha$ demands a larger gap.`, why:`The margin sets how much farther the negative must be.`},
        {do:`So a bigger margin is harder to satisfy, pushing embeddings to separate more strongly.`, why:`A wider margin yields more robust, better-separated encodings.`}
      ],
      answer:`Harder to satisfy; it forces wider separation between same- and different-person encodings.` }
  ]);

  /* =============================================================
     dl-style-transfer — HARDER: full Gram matrices, normalized
     style cost, combined weighted content+style cost.
     ============================================================= */
  add("dl-style-transfer", [
    { q:`<p>Two feature rows of a layer are $f_1 = [1, 2, 1]$ and $f_2 = [2, 0, 3]$. Build the $2\\times2$ Gram matrix $G$ where $G_{ij} = f_i \\cdot f_j$.</p>`,
      steps:[
        {do:`$G_{11} = 1+4+1 = 6$; $G_{22} = 4+0+9 = 13$.`, why:`Diagonal entries are each row dotted with itself.`},
        {do:`$G_{12} = G_{21} = 1\\cdot2 + 2\\cdot0 + 1\\cdot3 = 5$.`, why:`Off-diagonal entries measure correlation between the two feature maps.`}
      ],
      answer:`$G = \\begin{bmatrix}6 & 5\\\\5 & 13\\end{bmatrix}$` },

    { q:`<p>The generated Gram is $G_g = \\begin{bmatrix}6 & 5\\\\5 & 13\\end{bmatrix}$ and the style Gram is $G_s = \\begin{bmatrix}4 & 3\\\\3 & 10\\end{bmatrix}$. Style cost is $\\sum_{i,j}(G_g - G_s)^2$. Find it.</p>`,
      steps:[
        {do:`Entry diffs: $6-4=2$, $5-3=2$, $5-3=2$, $13-10=3$.`, why:`Style cost compares every Gram entry.`},
        {do:`Square and sum: $2^2 + 2^2 + 2^2 + 3^2 = 4+4+4+9 = 21$.`, why:`Add the squared differences over all entries.`}
      ],
      answer:`$21$` },

    { q:`<p>A layer has $n_C = 2$ filters and $n_H \\cdot n_W = 4$ positions. The style normalizer is $\\frac{1}{(2\\, n_C\\, n_H n_W)^2}$. Compute it.</p>`,
      steps:[
        {do:`Inside: $2 \\cdot n_C \\cdot n_H n_W = 2 \\times 2 \\times 4 = 16$.`, why:`Plug the layer dimensions into the normalizer.`},
        {do:`Square and invert: $\\frac{1}{16^2} = \\frac{1}{256}$.`, why:`The constant rescales the raw Gram-difference sum.`}
      ],
      answer:`$\\frac{1}{256}$` },

    { q:`<p>Content cost is $\\frac{1}{2}\\sum (g - c)^2$ over feature maps $g = [4, 1, 3]$ and $c = [2, 1, 0]$. Find it.</p>`,
      steps:[
        {do:`Per-spot gaps: $4-2=2$, $1-1=0$, $3-0=3$; squares $4, 0, 9$, sum $13$.`, why:`Content cost compares generated features to the photo's.`},
        {do:`Multiply by $\\frac{1}{2}$: $\\frac{13}{2} = 6.5$.`, why:`The standard content cost carries a $\\frac{1}{2}$ factor.`}
      ],
      answer:`$6.5$` },

    { q:`<p>Total cost is $J = \\alpha\\,J_{\\text{content}} + \\beta\\,J_{\\text{style}}$ with $\\alpha = 10$, $\\beta = 40$, $J_{\\text{content}} = 3$, $J_{\\text{style}} = 0.5$. Find $J$.</p>`,
      steps:[
        {do:`Content term: $10 \\times 3 = 30$.`, why:`Weight the content cost by $\\alpha$.`},
        {do:`Style term: $40 \\times 0.5 = 20$; total $J = 30 + 20 = 50$.`, why:`Weighted sum of the two costs.`}
      ],
      answer:`$J = 50$` },

    { q:`<p>If you raise $\\beta$ (style weight) relative to $\\alpha$ (content weight), what happens to the generated image?</p>`,
      steps:[
        {do:`A larger $\\beta$ makes the style cost dominate the total.`, why:`Optimization focuses on whatever term is weighted most.`},
        {do:`The result matches the style image's textures more, at the expense of content fidelity.`, why:`Style and content compete in the combined objective.`}
      ],
      answer:`The output looks more like the style (more texture), less like the content photo.` },

    { q:`<p>A Gram matrix is built from feature rows $f_1 = [3, 0]$, $f_2 = [0, 4]$. Find $G$, and explain what $G_{12} = 0$ means.</p>`,
      steps:[
        {do:`$G_{11} = 9$, $G_{22} = 16$, $G_{12} = 3\\cdot0 + 0\\cdot4 = 0$.`, why:`Compute each dot product.`},
        {do:`$G_{12} = 0$ means the two feature maps never fire together (uncorrelated).`, why:`Zero correlation indicates the features activate on different patterns.`}
      ],
      answer:`$G = \\begin{bmatrix}9 & 0\\\\0 & 16\\end{bmatrix}$; the off-diagonal $0$ means the two features are uncorrelated.` },

    { q:`<p>Style cost sums over layers: $J_{\\text{style}} = \\sum_l \\lambda_l\\,J^{[l]}$. With $\\lambda = [0.5, 0.5]$ and layer costs $J^{[1]} = 8$, $J^{[2]} = 4$, find $J_{\\text{style}}$.</p>`,
      steps:[
        {do:`Weight each layer: $0.5\\times8 = 4$ and $0.5\\times4 = 2$.`, why:`Each layer contributes a weighted share of the style cost.`},
        {do:`Sum: $4 + 2 = 6$.`, why:`Total style cost adds the weighted per-layer costs.`}
      ],
      answer:`$J_{\\text{style}} = 6$` },

    { q:`<p>A $3\\times3$ Gram is symmetric. Given $G_{12} = 5$, $G_{13} = 2$, $G_{23} = 7$ and diagonal $G_{11}=4, G_{22}=9, G_{33}=1$, write the full matrix.</p>`,
      steps:[
        {do:`Symmetry: $G_{21}=5$, $G_{31}=2$, $G_{32}=7$.`, why:`$G_{ij} = f_i\\cdot f_j = f_j\\cdot f_i = G_{ji}$.`},
        {do:`Fill in: $G = \\begin{bmatrix}4 & 5 & 2\\\\5 & 9 & 7\\\\2 & 7 & 1\\end{bmatrix}$.`, why:`Place the given entries and their mirror images.`}
      ],
      answer:`$G = \\begin{bmatrix}4 & 5 & 2\\\\5 & 9 & 7\\\\2 & 7 & 1\\end{bmatrix}$` },

    { q:`<p>Why does style transfer compare Gram matrices instead of comparing the raw feature maps directly?</p>`,
      steps:[
        {do:`Raw feature maps encode where features appear (spatial layout).`, why:`Matching them would force the content's exact positions.`},
        {do:`The Gram matrix records only how features co-occur, dropping position, so it captures texture independent of layout.`, why:`Style is a statistic of correlations, not a map of locations.`}
      ],
      answer:`Gram matrices capture feature correlations (texture) while discarding spatial position.` }
  ]);

})();
