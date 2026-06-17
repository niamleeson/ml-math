(function(){ Object.assign(window.PRACTICE, {

  /* =============================================================
     dl-batchnorm — center & scale a small batch.
     Mean, variance, normalized value.
     ============================================================= */
  "dl-batchnorm": [
    { q:`<p>A mini-batch has values $[2, 4, 6]$. Find the mean $\\mu_B$.</p>`,
      steps:[
        {do:`Add the values: $2 + 4 + 6 = 12$.`, why:`The mean is the total divided by the count.`},
        {do:`Divide by the count $3$: $\\mu_B = \\frac{12}{3} = 4$.`, why:`There are 3 numbers in the batch.`}
      ],
      answer:`$\\mu_B = 4$` },

    { q:`<p>A mini-batch has values $[1, 3, 5, 7]$. Find the mean $\\mu_B$.</p>`,
      steps:[
        {do:`Add: $1 + 3 + 5 + 7 = 16$.`, why:`Sum first, then divide.`},
        {do:`Divide by $4$: $\\mu_B = \\frac{16}{4} = 4$.`, why:`Four values in the batch.`}
      ],
      answer:`$\\mu_B = 4$` },

    { q:`<p>The batch $[2, 4, 6]$ has mean $\\mu_B = 4$. Find the variance $\\sigma_B^2$.</p>`,
      steps:[
        {do:`Find each gap from the mean: $2-4=-2$, $4-4=0$, $6-4=2$.`, why:`Variance measures how far values sit from the mean.`},
        {do:`Square them: $(-2)^2=4$, $0^2=0$, $2^2=4$.`, why:`Squaring removes minus signs and weights big gaps more.`},
        {do:`Average the squares: $\\sigma_B^2 = \\frac{4+0+4}{3} = \\frac{8}{3} \\approx 2.67$.`, why:`Variance is the mean of the squared gaps.`}
      ],
      answer:`$\\sigma_B^2 \\approx 2.67$` },

    { q:`<p>The batch $[1, 3, 5]$ has mean $\\mu_B = 3$. Find the variance $\\sigma_B^2$.</p>`,
      steps:[
        {do:`Gaps from the mean: $1-3=-2$, $3-3=0$, $5-3=2$.`, why:`Subtract the mean from each value.`},
        {do:`Square: $4, 0, 4$. Average: $\\sigma_B^2 = \\frac{4+0+4}{3} = \\frac{8}{3} \\approx 2.67$.`, why:`Variance is the average squared gap.`}
      ],
      answer:`$\\sigma_B^2 \\approx 2.67$` },

    { q:`<p>A batch has mean $\\mu_B = 4$ and variance $\\sigma_B^2 = 4$ (so spread $\\sqrt{4}=2$). Normalize the value $x_i = 6$. Use $\\epsilon \\approx 0$.</p>`,
      steps:[
        {do:`Use $\\hat{x} = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$.`, why:`This centers at 0 and scales to a steady size.`},
        {do:`Plug in: $\\hat{x} = \\frac{6 - 4}{\\sqrt{4}} = \\frac{2}{2} = 1$.`, why:`Subtract the mean, divide by the spread.`}
      ],
      answer:`$\\hat{x} = 1$` },

    { q:`<p>A batch has mean $\\mu_B = 10$ and spread $\\sqrt{\\sigma_B^2 + \\epsilon} = 5$. Normalize the value $x_i = 5$.</p>`,
      steps:[
        {do:`Center: $x_i - \\mu_B = 5 - 10 = -5$.`, why:`Subtract the batch mean first.`},
        {do:`Divide by spread: $\\hat{x} = \\frac{-5}{5} = -1$.`, why:`Below the mean gives a negative normalized value.`}
      ],
      answer:`$\\hat{x} = -1$` },

    { q:`<p>A normalized value is $\\hat{x} = 1$. The learned scale is $\\gamma = 2$ and shift is $\\beta = 3$. Find the final batch-norm output.</p>`,
      steps:[
        {do:`Output is $\\gamma\\,\\hat{x} + \\beta$.`, why:`After normalizing, the network re-stretches and re-shifts.`},
        {do:`Plug in: $2 \\times 1 + 3 = 5$.`, why:`Scale by $\\gamma$, then add $\\beta$.`}
      ],
      answer:`$5$` },

    { q:`<p>For the batch $[2, 4, 6]$, the value $4$ normalizes to $\\hat{x} = 0$. With $\\gamma = 5$ and $\\beta = -1$, find the output for that value.</p>`,
      steps:[
        {do:`The value equals the mean, so $\\hat{x} = \\frac{4-4}{\\text{spread}} = 0$.`, why:`A value at the mean centers to exactly 0.`},
        {do:`Output: $\\gamma\\,\\hat{x} + \\beta = 5 \\times 0 + (-1) = -1$.`, why:`The scaled 0 vanishes, leaving just the shift $\\beta$.`}
      ],
      answer:`$-1$` },

    { q:`<p>Normalize the whole batch $[2, 4, 6]$. It has mean $4$ and spread $\\approx 1.63$. Give the three normalized values.</p>`,
      steps:[
        {do:`Center each: $2-4=-2$, $4-4=0$, $6-4=2$.`, why:`Subtract the mean from every value.`},
        {do:`Divide each by $1.63$: $\\frac{-2}{1.63}\\approx -1.23$, $0$, $\\frac{2}{1.63}\\approx 1.23$.`, why:`Each value is rescaled by the batch spread.`}
      ],
      answer:`$[-1.23,\\; 0,\\; 1.23]$` },

    { q:`<p>Why does batch norm add a tiny $\\epsilon$ inside $\\sqrt{\\sigma_B^2 + \\epsilon}$?</p>`,
      steps:[
        {do:`We divide by $\\sqrt{\\sigma_B^2 + \\epsilon}$ when normalizing.`, why:`The spread sits in the denominator.`},
        {do:`If a batch has variance $0$, the spread is $0$ and dividing by $0$ breaks. Adding $\\epsilon$ keeps it positive.`, why:`$\\epsilon$ guards against divide-by-zero.`}
      ],
      answer:`To avoid dividing by zero when the variance is $0$.` }
  ],

  /* =============================================================
     dl-early-stopping — read a validation curve, decide to stop.
     ============================================================= */
  "dl-early-stopping": [
    { q:`<p>Validation error by epoch: $0.50, 0.40, 0.35, 0.36, 0.39$. Which epoch had the best (lowest) validation error?</p>`,
      steps:[
        {do:`Scan for the smallest value: $0.50, 0.40, 0.35, 0.36, 0.39$.`, why:`The best model is where validation error bottoms out.`},
        {do:`The lowest is $0.35$, at epoch $3$.`, why:`Smaller validation error means better generalization.`}
      ],
      answer:`Epoch $3$` },

    { q:`<p>Validation error: $0.60, 0.45, 0.30, 0.33, 0.40$. Patience is $2$. At which epoch do you stop?</p>`,
      steps:[
        {do:`Best is $0.30$ at epoch $3$. Save that model.`, why:`We track the best-so-far validation error.`},
        {do:`Epoch 4 ($0.33$) and epoch 5 ($0.40$) are both worse: 2 epochs with no improvement.`, why:`Patience counts consecutive epochs without a new best.`},
        {do:`Patience of $2$ is reached after epoch $5$, so stop there.`, why:`We wait 2 epochs to be sure the rise is real.`}
      ],
      answer:`Stop after epoch $5$ (keep the epoch-3 model).` },

    { q:`<p>With patience $= 2$ and validation error $0.30$ (best) at epoch 3, then $0.33$ at epoch 4 and $0.40$ at epoch 5, which model do you keep?</p>`,
      steps:[
        {do:`The best validation error was $0.30$ at epoch $3$.`, why:`Early stopping keeps the best saved model, not the last one.`},
        {do:`Epochs 4 and 5 are worse (overfitting), so we discard them.`, why:`Later models memorize training data and generalize worse.`}
      ],
      answer:`Keep the epoch-3 model.` },

    { q:`<p>Training error: $0.40, 0.30, 0.25$. Validation error: $0.45, 0.35, 0.38$. Is the model overfitting by epoch 3?</p>`,
      steps:[
        {do:`Training error keeps falling: $0.40 \\to 0.30 \\to 0.25$.`, why:`Training error almost always drops as the model fits the data.`},
        {do:`Validation error fell then rose: $0.45 \\to 0.35 \\to 0.38$.`, why:`A rising validation gap signals memorizing, not learning.`}
      ],
      answer:`Yes — validation error rose at epoch 3 while training error fell.` },

    { q:`<p>Validation error: $0.50, 0.48, 0.47, 0.46$. Patience $= 2$. Should you stop yet?</p>`,
      steps:[
        {do:`Check if any epoch failed to improve: $0.50, 0.48, 0.47, 0.46$ keeps dropping.`, why:`Each new value is a new best.`},
        {do:`There are $0$ epochs without improvement, which is below patience $2$.`, why:`Stop only after patience-many bad epochs in a row.`}
      ],
      answer:`No — keep training, error is still improving.` },

    { q:`<p>Validation error: $0.40, 0.42, 0.41, 0.39$. Patience $= 2$. Should you have stopped at epoch 3?</p>`,
      steps:[
        {do:`Best so far at epoch 1 is $0.40$. Epoch 2 ($0.42$) is worse: 1 bad epoch.`, why:`Count bad epochs since the last best.`},
        {do:`Epoch 3 ($0.41$) is still worse than $0.40$: 2 bad epochs, hitting patience.`, why:`At patience we would stop.`},
        {do:`But epoch 4 ($0.39$) is a new best — stopping at 3 would have missed it.`, why:`This shows why patience is a tradeoff, not a guarantee.`}
      ],
      answer:`Patience of 2 would stop at epoch 3, missing the better epoch-4 model.` },

    { q:`<p>Patience is $3$. After the best epoch, validation error is worse for $2$ epochs in a row. Do you stop?</p>`,
      steps:[
        {do:`Count bad epochs: $2$.`, why:`We stop only at patience-many bad epochs.`},
        {do:`Compare to patience $3$: $2 < 3$.`, why:`Two is not yet enough to trigger stopping.`}
      ],
      answer:`No — keep training (need 3 bad epochs).` },

    { q:`<p>Why watch validation error, not training error, to decide when to stop?</p>`,
      steps:[
        {do:`Training error almost always keeps falling as the model fits its own data.`, why:`It does not reveal memorizing.`},
        {do:`Validation error is on held-out data, so it reflects real-world performance.`, why:`Its rise is the signal of overfitting.`}
      ],
      answer:`Validation error reflects generalization; training error keeps dropping even while overfitting.` },

    { q:`<p>Validation error: $0.55, 0.50, 0.50, 0.52, 0.58$. Which epoch is the best to keep?</p>`,
      steps:[
        {do:`Find the minimum: $0.55, 0.50, 0.50, 0.52, 0.58$.`, why:`The lowest validation error is the best model.`},
        {do:`The smallest is $0.50$, first reached at epoch $2$.`, why:`When tied, the earliest best is usually kept.`}
      ],
      answer:`Epoch $2$` },

    { q:`<p>Early stopping saves the best model at epoch $4$ but trains until epoch $9$. How many extra epochs were trained past the best?</p>`,
      steps:[
        {do:`Subtract: $9 - 4 = 5$.`, why:`Patience lets training continue a while past the best to confirm.`},
        {do:`So $5$ epochs ran after the best one was found.`, why:`Those extra epochs cost compute but confirm the stop.`}
      ],
      answer:`$5$ extra epochs` }
  ],

  /* =============================================================
     dl-conv — convolve a tiny patch with a small filter (dot products).
     ============================================================= */
  "dl-conv": [
    { q:`<p>Convolve filter $\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$ with patch $\\begin{bmatrix}3 & 5\\\\2 & 4\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply matching cells: $1\\times3=3$, $0\\times5=0$, $0\\times2=0$, $1\\times4=4$.`, why:`Convolution is element-wise multiply, then sum.`},
        {do:`Add them: $3 + 0 + 0 + 4 = 7$.`, why:`The sum is the one output number for this position.`}
      ],
      answer:`$7$` },

    { q:`<p>Convolve filter $\\begin{bmatrix}1 & 1\\\\1 & 1\\end{bmatrix}$ with patch $\\begin{bmatrix}2 & 3\\\\1 & 4\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply each cell: $1\\times2=2$, $1\\times3=3$, $1\\times1=1$, $1\\times4=4$.`, why:`An all-ones filter just sums the patch.`},
        {do:`Add: $2 + 3 + 1 + 4 = 10$.`, why:`Sum all the products for the output.`}
      ],
      answer:`$10$` },

    { q:`<p>Convolve filter $\\begin{bmatrix}1 & -1\\\\1 & -1\\end{bmatrix}$ with patch $\\begin{bmatrix}5 & 2\\\\3 & 1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply: $1\\times5=5$, $-1\\times2=-2$, $1\\times3=3$, $-1\\times1=-1$.`, why:`Negative weights subtract those pixels.`},
        {do:`Add: $5 - 2 + 3 - 1 = 5$.`, why:`This filter detects a left-vs-right edge.`}
      ],
      answer:`$5$` },

    { q:`<p>Convolve filter $\\begin{bmatrix}0 & 1\\\\1 & 0\\end{bmatrix}$ with patch $\\begin{bmatrix}6 & 2\\\\4 & 8\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply: $0\\times6=0$, $1\\times2=2$, $1\\times4=4$, $0\\times8=0$.`, why:`Zero weights ignore those pixels.`},
        {do:`Add: $0 + 2 + 4 + 0 = 6$.`, why:`Only the two corners with weight 1 contribute.`}
      ],
      answer:`$6$` },

    { q:`<p>Convolve filter $\\begin{bmatrix}2 & 0\\\\0 & 2\\end{bmatrix}$ with patch $\\begin{bmatrix}1 & 9\\\\9 & 3\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply: $2\\times1=2$, $0\\times9=0$, $0\\times9=0$, $2\\times3=6$.`, why:`The filter doubles the diagonal pixels.`},
        {do:`Add: $2 + 0 + 0 + 6 = 8$.`, why:`Sum the products for the output.`}
      ],
      answer:`$8$` },

    { q:`<p>Slide a $2\\times2$ filter $\\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$ over a $3\\times3$ image. How many output positions are there?</p>`,
      steps:[
        {do:`A $2\\times2$ filter fits in $3-2+1 = 2$ positions across each side.`, why:`Output size per side is $I - F + 1$ with stride 1, no padding.`},
        {do:`So the output grid is $2\\times2 = 4$ positions.`, why:`Width times height gives total positions.`}
      ],
      answer:`$4$ positions (a $2\\times2$ feature map)` },

    { q:`<p>Convolve filter $\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}$ with patch $\\begin{bmatrix}1 & 1\\\\1 & 1\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply: $1\\times1=1$, $2\\times1=2$, $3\\times1=3$, $4\\times1=4$.`, why:`A patch of all ones returns the filter's own sum.`},
        {do:`Add: $1 + 2 + 3 + 4 = 10$.`, why:`Sum the products.`}
      ],
      answer:`$10$` },

    { q:`<p>The top-left of a $3\\times3$ image is $\\begin{bmatrix}2 & 1\\\\0 & 3\\end{bmatrix}$. Convolve it with filter $\\begin{bmatrix}1 & 1\\\\1 & 1\\end{bmatrix}$ to get the first feature-map value.</p>`,
      steps:[
        {do:`Multiply each cell by 1 and sum: $2 + 1 + 0 + 3$.`, why:`The all-ones filter sums the patch.`},
        {do:`Total: $2 + 1 + 0 + 3 = 6$.`, why:`That is the first output number, before sliding.`}
      ],
      answer:`$6$` },

    { q:`<p>Convolve filter $\\begin{bmatrix}-1 & -1\\\\-1 & -1\\end{bmatrix}$ with patch $\\begin{bmatrix}2 & 1\\\\3 & 2\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Multiply: $-1\\times2=-2$, $-1\\times1=-1$, $-1\\times3=-3$, $-1\\times2=-2$.`, why:`Every weight is negative, so each product is negative.`},
        {do:`Add: $-2 - 1 - 3 - 2 = -8$.`, why:`Sum the products.`}
      ],
      answer:`$-8$` },

    { q:`<p>Why does a convolutional layer use far fewer weights than connecting every pixel to every neuron?</p>`,
      steps:[
        {do:`The same small filter slides over the whole image.`, why:`One filter's weights are reused at every position.`},
        {do:`So the weight count equals the filter size, not the image size.`, why:`This weight sharing keeps CNNs small and efficient.`}
      ],
      answer:`The filter's weights are shared across all positions, so the count does not grow with image size.` }
  ],

  /* =============================================================
     dl-pooling — max / average pool a small grid.
     ============================================================= */
  "dl-pooling": [
    { q:`<p>Max-pool the window $\\begin{bmatrix}1 & 7\\\\3 & 2\\end{bmatrix}$.</p>`,
      steps:[
        {do:`List the values: $1, 7, 3, 2$.`, why:`Max pooling looks at every value in the window.`},
        {do:`Take the largest: $\\max(1, 7, 3, 2) = 7$.`, why:`Max pooling keeps the strongest signal.`}
      ],
      answer:`$7$` },

    { q:`<p>Average-pool the window $\\begin{bmatrix}1 & 7\\\\3 & 5\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Add the values: $1 + 7 + 3 + 5 = 16$.`, why:`Average pooling sums then divides.`},
        {do:`Divide by 4: $\\frac{16}{4} = 4$.`, why:`There are 4 cells in a $2\\times2$ window.`}
      ],
      answer:`$4$` },

    { q:`<p>Max-pool the window $\\begin{bmatrix}4 & 1\\\\6 & 5\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Values: $4, 1, 6, 5$.`, why:`Scan the whole window.`},
        {do:`Largest: $\\max(4, 1, 6, 5) = 6$.`, why:`Keep the biggest value.`}
      ],
      answer:`$6$` },

    { q:`<p>Average-pool the window $\\begin{bmatrix}2 & 2\\\\2 & 2\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Add: $2 + 2 + 2 + 2 = 8$.`, why:`Sum every cell.`},
        {do:`Divide by 4: $\\frac{8}{4} = 2$.`, why:`All values equal, so the average equals the value.`}
      ],
      answer:`$2$` },

    { q:`<p>Apply $2\\times2$ max pooling (stride 2) to $\\begin{bmatrix}1 & 3 & 2 & 4\\\\5 & 6 & 1 & 2\\\\7 & 8 & 3 & 0\\\\1 & 2 & 5 & 9\\end{bmatrix}$. Give the top-left output.</p>`,
      steps:[
        {do:`The top-left $2\\times2$ block is $\\begin{bmatrix}1 & 3\\\\5 & 6\\end{bmatrix}$.`, why:`Non-overlapping windows cover the map in 2×2 blocks.`},
        {do:`Take the max: $\\max(1, 3, 5, 6) = 6$.`, why:`Max pooling keeps the largest in each block.`}
      ],
      answer:`$6$` },

    { q:`<p>A $4\\times4$ feature map is max-pooled with a $2\\times2$ window, stride 2. What is the output size?</p>`,
      steps:[
        {do:`Each side: $\\frac{4}{2} = 2$.`, why:`Non-overlapping 2×2 windows halve each dimension.`},
        {do:`So the output is $2\\times2$.`, why:`Width and height both shrink by the window size.`}
      ],
      answer:`$2\\times2$` },

    { q:`<p>Max-pool the full $\\begin{bmatrix}1 & 3 & 2 & 4\\\\5 & 6 & 1 & 2\\\\7 & 8 & 3 & 0\\\\1 & 2 & 5 & 9\\end{bmatrix}$ with $2\\times2$ windows (stride 2). Give all four outputs.</p>`,
      steps:[
        {do:`Top-left $\\max(1,3,5,6)=6$; top-right $\\max(2,4,1,2)=4$.`, why:`Pool each non-overlapping 2×2 block.`},
        {do:`Bottom-left $\\max(7,8,1,2)=8$; bottom-right $\\max(3,0,5,9)=9$.`, why:`Continue across the bottom row of blocks.`}
      ],
      answer:`$\\begin{bmatrix}6 & 4\\\\8 & 9\\end{bmatrix}$` },

    { q:`<p>Average-pool the window $\\begin{bmatrix}0 & 4\\\\8 & 0\\end{bmatrix}$.</p>`,
      steps:[
        {do:`Add: $0 + 4 + 8 + 0 = 12$.`, why:`Sum every cell.`},
        {do:`Divide by 4: $\\frac{12}{4} = 3$.`, why:`Average over the 4 cells.`}
      ],
      answer:`$3$` },

    { q:`<p>For the window $\\begin{bmatrix}2 & 9\\\\1 & 4\\end{bmatrix}$, how much bigger is the max-pool output than the average-pool output?</p>`,
      steps:[
        {do:`Max: $\\max(2,9,1,4) = 9$.`, why:`Max keeps the largest value.`},
        {do:`Average: $\\frac{2+9+1+4}{4} = \\frac{16}{4} = 4$. Difference: $9 - 4 = 5$.`, why:`Compare the two pooling outputs.`}
      ],
      answer:`$5$` },

    { q:`<p>Why does pooling make recognition robust to small shifts of an object?</p>`,
      steps:[
        {do:`Pooling summarizes a whole window with one number (the max or average).`, why:`Exact pixel position inside the window stops mattering.`},
        {do:`So if a feature moves a little within a window, the output stays about the same.`, why:`The model cares whether a feature appeared, not exactly where.`}
      ],
      answer:`Pooling summarizes each region, so small shifts inside a window barely change the output.` }
  ],

  /* =============================================================
     dl-conv-hyperparams — output size O = (I-F+2P)/S + 1.
     ============================================================= */
  "dl-conv-hyperparams": [
    { q:`<p>Input $I = 7$, filter $F = 3$, padding $P = 0$, stride $S = 1$. Find the output size $O$.</p>`,
      steps:[
        {do:`Formula: $O = \\frac{I - F + 2P}{S} + 1$.`, why:`This counts how many filter positions fit along one side.`},
        {do:`Plug in: $O = \\frac{7 - 3 + 0}{1} + 1 = \\frac{4}{1} + 1 = 5$.`, why:`Substitute $I=7, F=3, P=0, S=1$ and simplify.`}
      ],
      answer:`$5\\times5$` },

    { q:`<p>Input $I = 7$, filter $F = 3$, padding $P = 0$, stride $S = 2$. Find $O$.</p>`,
      steps:[
        {do:`Plug into $O = \\frac{I - F + 2P}{S} + 1$: $O = \\frac{7 - 3 + 0}{2} + 1$.`, why:`A bigger stride takes fewer steps.`},
        {do:`Simplify: $\\frac{4}{2} + 1 = 2 + 1 = 3$.`, why:`Stride 2 shrinks the output more than stride 1.`}
      ],
      answer:`$3\\times3$` },

    { q:`<p>Input $I = 5$, filter $F = 3$, padding $P = 1$, stride $S = 1$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{5 - 3 + 2\\times1}{1} + 1$.`, why:`Padding adds $2P$ in the numerator (both sides).`},
        {do:`Simplify: $\\frac{5 - 3 + 2}{1} + 1 = \\frac{4}{1} + 1 = 5$.`, why:`Padding of 1 here keeps the size the same.`}
      ],
      answer:`$5\\times5$` },

    { q:`<p>Input $I = 6$, filter $F = 2$, padding $P = 0$, stride $S = 2$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{6 - 2 + 0}{2} + 1$.`, why:`Substitute into the output-size formula.`},
        {do:`Simplify: $\\frac{4}{2} + 1 = 2 + 1 = 3$.`, why:`Divide by the stride, then add 1.`}
      ],
      answer:`$3\\times3$` },

    { q:`<p>Input $I = 32$, filter $F = 5$, padding $P = 0$, stride $S = 1$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{32 - 5 + 0}{1} + 1$.`, why:`Substitute the values.`},
        {do:`Simplify: $\\frac{27}{1} + 1 = 27 + 1 = 28$.`, why:`A 5×5 filter trims 4 off each side.`}
      ],
      answer:`$28\\times28$` },

    { q:`<p>Input $I = 28$, filter $F = 3$, padding $P = 1$, stride $S = 1$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{28 - 3 + 2\\times1}{1} + 1$.`, why:`Padding of 1 with a 3×3 filter usually preserves size.`},
        {do:`Simplify: $\\frac{28 - 3 + 2}{1} + 1 = \\frac{27}{1} + 1 = 28$.`, why:`Same-size output, the common "same padding" case.`}
      ],
      answer:`$28\\times28$` },

    { q:`<p>What padding $P$ keeps the output the same size as the input when $F = 3$, $S = 1$?</p>`,
      steps:[
        {do:`Set $O = I$ in $O = \\frac{I - F + 2P}{S} + 1$ with $S = 1$: $I = I - 3 + 2P + 1$.`, why:`Same-size means output equals input.`},
        {do:`Simplify: $0 = -3 + 2P + 1 = 2P - 2$, so $P = 1$.`, why:`Solve for the padding.`}
      ],
      answer:`$P = 1$` },

    { q:`<p>Input $I = 10$, filter $F = 4$, padding $P = 0$, stride $S = 2$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{10 - 4 + 0}{2} + 1$.`, why:`Substitute the values.`},
        {do:`Simplify: $\\frac{6}{2} + 1 = 3 + 1 = 4$.`, why:`Divide by stride 2, then add 1.`}
      ],
      answer:`$4\\times4$` },

    { q:`<p>Input $I = 8$, filter $F = 3$, padding $P = 1$, stride $S = 2$. Find $O$.</p>`,
      steps:[
        {do:`Plug in: $O = \\frac{8 - 3 + 2\\times1}{2} + 1$.`, why:`Add $2P = 2$ in the numerator.`},
        {do:`Simplify: $\\frac{8 - 3 + 2}{2} + 1 = \\frac{7}{2} + 1 = 3.5 + 1 = 4.5$, floor to $4$.`, why:`A non-whole result is rounded down: only whole filter positions count.`}
      ],
      answer:`$4\\times4$` },

    { q:`<p>In the formula $O = \\frac{I - F + 2P}{S} + 1$, what does increasing the stride $S$ do to the output size?</p>`,
      steps:[
        {do:`The stride $S$ is in the denominator.`, why:`A larger denominator makes the fraction smaller.`},
        {do:`So a bigger $S$ gives a smaller $O$.`, why:`Bigger jumps mean fewer filter positions fit.`}
      ],
      answer:`A larger stride shrinks the output.` }
  ],

  /* =============================================================
     dl-cnn-params — params = (F*F*C + 1)*K.
     ============================================================= */
  "dl-cnn-params": [
    { q:`<p>A conv layer has $K = 10$ filters, each $F = 3$, over $C = 3$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $F\\cdot F\\cdot C = 3\\times3\\times3 = 27$.`, why:`One filter covers $F\\times F$ cells across all $C$ channels.`},
        {do:`Add bias and multiply by $K$: $(27 + 1)\\times10 = 28\\times10 = 280$.`, why:`Each filter has one bias; there are $K$ filters.`}
      ],
      answer:`$280$` },

    { q:`<p>A conv layer has $K = 5$ filters, each $F = 2$, over $C = 1$ channel (grayscale). How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $2\\times2\\times1 = 4$.`, why:`A 2×2 filter over 1 channel has 4 weights.`},
        {do:`Add bias, times $K$: $(4 + 1)\\times5 = 5\\times5 = 25$.`, why:`Five filters, each with a bias.`}
      ],
      answer:`$25$` },

    { q:`<p>A conv layer has $K = 8$ filters, each $F = 3$, over $C = 1$ channel. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $3\\times3\\times1 = 9$.`, why:`A 3×3 grayscale filter has 9 weights.`},
        {do:`Add bias, times $K$: $(9 + 1)\\times8 = 10\\times8 = 80$.`, why:`Eight filters, each with a bias.`}
      ],
      answer:`$80$` },

    { q:`<p>A conv layer has $K = 16$ filters, each $F = 3$, over $C = 3$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $3\\times3\\times3 = 27$.`, why:`3×3 over 3 channels.`},
        {do:`Add bias, times $K$: $(27 + 1)\\times16 = 28\\times16 = 448$.`, why:`Sixteen filters, each with a bias.`}
      ],
      answer:`$448$` },

    { q:`<p>A conv layer has $K = 1$ filter, $F = 1$, over $C = 64$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $1\\times1\\times64 = 64$.`, why:`A 1×1 filter still spans all input channels.`},
        {do:`Add bias, times $K$: $(64 + 1)\\times1 = 65$.`, why:`One filter, one bias.`}
      ],
      answer:`$65$` },

    { q:`<p>A conv layer has $K = 32$ filters, each $F = 5$, over $C = 3$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $5\\times5\\times3 = 75$.`, why:`5×5 over 3 channels.`},
        {do:`Add bias, times $K$: $(75 + 1)\\times32 = 76\\times32 = 2432$.`, why:`Thirty-two filters, each with a bias.`}
      ],
      answer:`$2432$` },

    { q:`<p>A conv layer has $K = 10$ filters, each $F = 3$, over $C = 3$ channels. How many of its parameters are biases?</p>`,
      steps:[
        {do:`Each filter has exactly one bias.`, why:`The "$+1$" in the formula is the bias per filter.`},
        {do:`With $K = 10$ filters, that is $10$ biases.`, why:`Number of biases equals number of filters.`}
      ],
      answer:`$10$` },

    { q:`<p>Does a conv layer with $K=4$, $F=3$, $C=2$ have more parameters on a $32\\times32$ image or a $1000\\times1000$ image?</p>`,
      steps:[
        {do:`Compute params: $(3\\times3\\times2 + 1)\\times4 = (18+1)\\times4 = 76$.`, why:`The formula has no image-size term.`},
        {do:`The count is $76$ for both images.`, why:`The same filter is reused everywhere, so size does not matter.`}
      ],
      answer:`The same — $76$ parameters for both.` },

    { q:`<p>A conv layer has $K = 6$ filters, each $F = 2$, over $C = 4$ channels. How many parameters?</p>`,
      steps:[
        {do:`Weights per filter: $2\\times2\\times4 = 16$.`, why:`2×2 over 4 channels.`},
        {do:`Add bias, times $K$: $(16 + 1)\\times6 = 17\\times6 = 102$.`, why:`Six filters, each with a bias.`}
      ],
      answer:`$102$` },

    { q:`<p>In $\\text{params} = (F\\cdot F\\cdot C + 1)\\cdot K$, what does the "$+1$" stand for?</p>`,
      steps:[
        {do:`The $F\\cdot F\\cdot C$ part counts the filter's weights.`, why:`That is the multiply-and-add part.`},
        {do:`The "$+1$" is the bias added once per filter.`, why:`Each filter gets one extra learnable bias number.`}
      ],
      answer:`The bias — one per filter.` }
  ],

  /* =============================================================
     dl-object-detection — IoU = overlap / union.
     ============================================================= */
  "dl-object-detection": [
    { q:`<p>Two boxes overlap by area $20$. Box A area $= 40$, Box B area $= 30$. Find the IoU.</p>`,
      steps:[
        {do:`Union $= A + B - \\text{overlap} = 40 + 30 - 20 = 50$.`, why:`Subtract the overlap so the shared part is counted once.`},
        {do:`IoU $= \\frac{\\text{overlap}}{\\text{union}} = \\frac{20}{50} = 0.4$.`, why:`IoU is overlap divided by union.`}
      ],
      answer:`$0.4$` },

    { q:`<p>Overlap area $= 10$. Box A $= 25$, Box B $= 25$. Find the IoU.</p>`,
      steps:[
        {do:`Union $= 25 + 25 - 10 = 40$.`, why:`Add the areas, subtract the double-counted overlap.`},
        {do:`IoU $= \\frac{10}{40} = 0.25$.`, why:`Divide overlap by union.`}
      ],
      answer:`$0.25$` },

    { q:`<p>Two identical boxes sit exactly on top of each other, each area $50$. Find the IoU.</p>`,
      steps:[
        {do:`Overlap $= 50$ (full); Union $= 50 + 50 - 50 = 50$.`, why:`Perfect overlap means union equals one box.`},
        {do:`IoU $= \\frac{50}{50} = 1$.`, why:`A perfect match scores 1.`}
      ],
      answer:`$1$` },

    { q:`<p>Two boxes do not overlap at all. Box A $= 30$, Box B $= 20$. Find the IoU.</p>`,
      steps:[
        {do:`Overlap $= 0$; Union $= 30 + 20 - 0 = 50$.`, why:`No shared area means overlap is 0.`},
        {do:`IoU $= \\frac{0}{50} = 0$.`, why:`No overlap scores 0.`}
      ],
      answer:`$0$` },

    { q:`<p>A predicted box and the true box are both $4\\times4$ squares (area $16$). They overlap in a $2\\times4$ strip. Find the IoU.</p>`,
      steps:[
        {do:`Overlap area $= 2\\times4 = 8$.`, why:`Width times height of the shared strip.`},
        {do:`Union $= 16 + 16 - 8 = 24$; IoU $= \\frac{8}{24} = \\frac{1}{3} \\approx 0.33$.`, why:`Overlap over union.`}
      ],
      answer:`$\\approx 0.33$` },

    { q:`<p>Overlap area $= 12$. Box A $= 20$, Box B $= 20$. Is the IoU above the usual $0.5$ threshold?</p>`,
      steps:[
        {do:`Union $= 20 + 20 - 12 = 28$; IoU $= \\frac{12}{28} \\approx 0.43$.`, why:`Compute the IoU first.`},
        {do:`Compare to $0.5$: $0.43 < 0.5$.`, why:`Below the threshold counts as a poor match.`}
      ],
      answer:`No — IoU $\\approx 0.43$, below $0.5$.` },

    { q:`<p>Two $3\\times3$ boxes (area $9$ each) overlap in a $1\\times1$ corner. Find the IoU.</p>`,
      steps:[
        {do:`Overlap $= 1\\times1 = 1$.`, why:`A single shared cell.`},
        {do:`Union $= 9 + 9 - 1 = 17$; IoU $= \\frac{1}{17} \\approx 0.06$.`, why:`Tiny overlap gives a low score.`}
      ],
      answer:`$\\approx 0.06$` },

    { q:`<p>The intersection of two boxes is $15$ and their union is $30$. Find the IoU.</p>`,
      steps:[
        {do:`IoU $= \\frac{\\text{intersection}}{\\text{union}} = \\frac{15}{30}$.`, why:`Apply the IoU definition directly.`},
        {do:`Simplify: $\\frac{15}{30} = 0.5$.`, why:`This sits exactly at the common threshold.`}
      ],
      answer:`$0.5$` },

    { q:`<p>If the overlap area equals the union area, what is the IoU, and what does it mean?</p>`,
      steps:[
        {do:`IoU $= \\frac{\\text{overlap}}{\\text{union}} = \\frac{u}{u} = 1$.`, why:`Overlap equal to union means the boxes match perfectly.`},
        {do:`That is the maximum score.`, why:`The predicted box sits exactly on the true box.`}
      ],
      answer:`$1$ — a perfect match.` },

    { q:`<p>Why does the union subtract the overlap: union $= A + B - \\text{overlap}$?</p>`,
      steps:[
        {do:`Adding $A + B$ counts the shared region twice.`, why:`The overlap belongs to both boxes.`},
        {do:`Subtract the overlap once to count it a single time.`, why:`Union is the total area covered, overlap counted once.`}
      ],
      answer:`Because adding both areas double-counts the shared overlap, so we subtract it once.` }
  ],

  /* =============================================================
     dl-face-recognition — triplet loss max(d(A,P)-d(A,N)+alpha, 0).
     ============================================================= */
  "dl-face-recognition": [
    { q:`<p>$d(A,P) = 0.3$, $d(A,N) = 0.5$, margin $\\alpha = 0.2$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside the max: $d(A,P) - d(A,N) + \\alpha = 0.3 - 0.5 + 0.2 = 0$.`, why:`We want the positive closer than the negative by the margin.`},
        {do:`Loss $= \\max(0, 0) = 0$.`, why:`The margin is exactly met, so no penalty.`}
      ],
      answer:`$0$` },

    { q:`<p>$d(A,P) = 0.3$, $d(A,N) = 0.4$, margin $\\alpha = 0.2$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.3 - 0.4 + 0.2 = 0.1$.`, why:`The negative is not far enough yet.`},
        {do:`Loss $= \\max(0.1, 0) = 0.1$.`, why:`A positive inside means there is loss to reduce.`}
      ],
      answer:`$0.1$` },

    { q:`<p>$d(A,P) = 0.2$, $d(A,N) = 0.9$, margin $\\alpha = 0.3$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.2 - 0.9 + 0.3 = -0.4$.`, why:`The negative is already much farther than needed.`},
        {do:`Loss $= \\max(-0.4, 0) = 0$.`, why:`Negative inside is clipped to 0 — nothing to fix.`}
      ],
      answer:`$0$` },

    { q:`<p>$d(A,P) = 0.5$, $d(A,N) = 0.5$, margin $\\alpha = 0.2$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.5 - 0.5 + 0.2 = 0.2$.`, why:`Same person and different person are equally close — bad.`},
        {do:`Loss $= \\max(0.2, 0) = 0.2$.`, why:`Training will push them apart.`}
      ],
      answer:`$0.2$` },

    { q:`<p>$d(A,P) = 0.6$, $d(A,N) = 0.2$, margin $\\alpha = 0.1$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.6 - 0.2 + 0.1 = 0.5$.`, why:`The negative is closer than the positive — the worst case.`},
        {do:`Loss $= \\max(0.5, 0) = 0.5$.`, why:`A big positive loss means a strong correction.`}
      ],
      answer:`$0.5$` },

    { q:`<p>$d(A,P) = 0.1$, $d(A,N) = 0.1$, margin $\\alpha = 0$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.1 - 0.1 + 0 = 0$.`, why:`With no margin, equal distances give exactly 0.`},
        {do:`Loss $= \\max(0, 0) = 0$.`, why:`No margin to enforce, so no penalty.`}
      ],
      answer:`$0$` },

    { q:`<p>$d(A,P) = 0.4$, $d(A,N) = 0.7$, margin $\\alpha = 0.5$. Find the triplet loss.</p>`,
      steps:[
        {do:`Inside: $0.4 - 0.7 + 0.5 = 0.2$.`, why:`The big margin demands the negative be even farther.`},
        {do:`Loss $= \\max(0.2, 0) = 0.2$.`, why:`A larger margin makes the loss harder to drive to 0.`}
      ],
      answer:`$0.2$` },

    { q:`<p>For loss to be $0$, how far must $d(A,N)$ be, given $d(A,P) = 0.3$ and $\\alpha = 0.2$?</p>`,
      steps:[
        {do:`Loss is 0 when $d(A,P) - d(A,N) + \\alpha \\le 0$, i.e. $d(A,N) \\ge d(A,P) + \\alpha$.`, why:`The negative must beat the positive by at least the margin.`},
        {do:`Plug in: $d(A,N) \\ge 0.3 + 0.2 = 0.5$.`, why:`At or beyond 0.5 the margin is met.`}
      ],
      answer:`$d(A,N) \\ge 0.5$` },

    { q:`<p>In triplet loss, which distance do we want small and which do we want large?</p>`,
      steps:[
        {do:`$d(A,P)$ is the same person's two photos — we want this small.`, why:`Same person should encode close together.`},
        {do:`$d(A,N)$ is a different person — we want this large.`, why:`Different people should encode far apart.`}
      ],
      answer:`Small $d(A,P)$, large $d(A,N)$.` },

    { q:`<p>What does the $\\max(\\cdot, 0)$ in triplet loss accomplish?</p>`,
      steps:[
        {do:`If the margin is already met, the inside is negative.`, why:`That means the triplet is already correct.`},
        {do:`$\\max(\\cdot, 0)$ clips that to 0, so there is no loss to reduce.`, why:`Training only spends effort on triplets that still violate the margin.`}
      ],
      answer:`It zeroes out the loss once the margin is satisfied.` }
  ],

  /* =============================================================
     dl-style-transfer — Gram-matrix entry / content cost.
     ============================================================= */
  "dl-style-transfer": [
    { q:`<p>Two feature vectors are $f_1 = [1, 2]$ and $f_2 = [3, 4]$. The Gram entry $G_{12}$ is their dot product. Find $G_{12}$.</p>`,
      steps:[
        {do:`Dot product: $f_1 \\cdot f_2 = 1\\times3 + 2\\times4$.`, why:`A Gram entry measures how two feature maps correlate.`},
        {do:`Compute: $3 + 8 = 11$.`, why:`Sum the products.`}
      ],
      answer:`$G_{12} = 11$` },

    { q:`<p>A flattened feature map is $f = [2, 0, 1]$. The Gram diagonal entry $G_{11} = f \\cdot f$. Find it.</p>`,
      steps:[
        {do:`Dot a vector with itself: $2\\times2 + 0\\times0 + 1\\times1$.`, why:`The diagonal measures how strongly a feature fires with itself.`},
        {do:`Compute: $4 + 0 + 1 = 5$.`, why:`Sum the squares.`}
      ],
      answer:`$G_{11} = 5$` },

    { q:`<p>Feature vectors $f_1 = [1, 0, 2]$ and $f_2 = [0, 3, 1]$. Find the Gram entry $G_{12} = f_1 \\cdot f_2$.</p>`,
      steps:[
        {do:`Multiply matching entries: $1\\times0 + 0\\times3 + 2\\times1$.`, why:`Dot product pairs up the entries.`},
        {do:`Sum: $0 + 0 + 2 = 2$.`, why:`Add the products for the correlation value.`}
      ],
      answer:`$G_{12} = 2$` },

    { q:`<p>The generated image's content feature is $g = 5$ and the photo's is $c = 2$ at one spot. The content cost there is $(g - c)^2$. Find it.</p>`,
      steps:[
        {do:`Difference: $g - c = 5 - 2 = 3$.`, why:`Content cost compares generated features to the photo's.`},
        {do:`Square it: $3^2 = 9$.`, why:`Squaring makes the cost positive and punishes big gaps.`}
      ],
      answer:`$9$` },

    { q:`<p>At one location, generated feature $g = 4$, content feature $c = 4$. Find the content cost $(g - c)^2$.</p>`,
      steps:[
        {do:`Difference: $4 - 4 = 0$.`, why:`Matching features mean no content mismatch.`},
        {do:`Square: $0^2 = 0$.`, why:`A perfect match gives zero content cost.`}
      ],
      answer:`$0$` },

    { q:`<p>Content cost over two spots is $\\sum (g - c)^2$ with values $g = [3, 1]$ and $c = [1, 2]$. Find the total.</p>`,
      steps:[
        {do:`Per-spot gaps: $3-1 = 2$ and $1-2 = -1$.`, why:`Compare each generated value to the photo.`},
        {do:`Square and sum: $2^2 + (-1)^2 = 4 + 1 = 5$.`, why:`Total content cost adds the squared gaps.`}
      ],
      answer:`$5$` },

    { q:`<p>A style Gram is built from $f = [1, 2]$. Find the full $2\\times2$ Gram matrix $G$, where $G_{ij} = f_i f_j$.</p>`,
      steps:[
        {do:`Entries: $G_{11} = 1\\times1 = 1$, $G_{12} = 1\\times2 = 2$, $G_{21} = 2\\times1 = 2$, $G_{22} = 2\\times2 = 4$.`, why:`Each entry pairs two feature values.`},
        {do:`Assemble: $G = \\begin{bmatrix}1 & 2\\\\2 & 4\\end{bmatrix}$.`, why:`The Gram matrix is symmetric.`}
      ],
      answer:`$G = \\begin{bmatrix}1 & 2\\\\2 & 4\\end{bmatrix}$` },

    { q:`<p>The style cost at one entry is $(G_{\\text{gen}} - G_{\\text{style}})^2$. If $G_{\\text{gen}} = 7$ and $G_{\\text{style}} = 4$, find it.</p>`,
      steps:[
        {do:`Difference: $7 - 4 = 3$.`, why:`Style cost compares Gram entries, not raw features.`},
        {do:`Square: $3^2 = 9$.`, why:`Squaring gives a positive cost.`}
      ],
      answer:`$9$` },

    { q:`<p>Total cost is content cost plus style cost. If content cost $= 6$ and style cost $= 10$, find the total.</p>`,
      steps:[
        {do:`Add them: $6 + 10$.`, why:`Total cost = content cost + style cost.`},
        {do:`Total $= 16$.`, why:`Both costs are driven down together during transfer.`}
      ],
      answer:`$16$` },

    { q:`<p>What does the Gram matrix capture that the raw feature map does not?</p>`,
      steps:[
        {do:`The Gram entry $G_{ij} = f_i \\cdot f_j$ measures how features fire together.`, why:`It is a correlation, not a position.`},
        {do:`So it captures texture and style, dropping the exact spatial layout.`, why:`Style is about how features co-occur, not where they sit.`}
      ],
      answer:`Feature correlations (texture/style), not the spatial layout.` }
  ]

}); })();
