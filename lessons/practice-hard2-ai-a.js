(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* ===================== LINEAR PREDICTORS (harder, set 2) ===================== */
  add("ai-linear-predictors", [
    { q:`<p>Bias inside the weights. $\\phi(x)=[1,2,-1,3]$ (first entry is the constant bias feature), $w=[-2,1,4,0.5]$. Compute the score and prediction.</p>`,
      steps:[
        {do:`Pair and multiply: $-2\\times1=-2$, $1\\times2=2$, $4\\times(-1)=-4$, $0.5\\times3=1.5$.`, why:`The dot product multiplies each weight by its matching feature, including the bias.`},
        {do:`Sum: $-2+2-4+1.5=-2.5$.`, why:`The score is the full sum of weighted features.`},
        {do:`$\\text{sign}(-2.5)=-1$, so $f_w(x)=-1$.`, why:`A negative score gives the "no" class.`}
      ],
      answer:`$s=-2.5,\\ f_w(x)=-1$` },

    { q:`<p>Five labelled points with $(s,y)$ pairs: $(1.5,+1)$, $(-0.5,+1)$, $(-2,-1)$, $(0.5,-1)$, $(3,+1)$. Count correct classifications and report the average zero-one loss.</p>`,
      steps:[
        {do:`Margins $m=s\\cdot y$: $1.5,\\ -0.5,\\ 2,\\ -0.5,\\ 3$.`, why:`Multiply each score by its label; $m>0$ means correct.`},
        {do:`Positive margins: $1.5, 2, 3$, so $3$ correct, $2$ wrong.`, why:`The second and fourth points have negative margins.`},
        {do:`Zero-one loss average $=2/5=0.4$.`, why:`Two mistakes out of five examples.`}
      ],
      answer:`$3$ correct, zero-one loss $0.4$` },

    { q:`<p>A perceptron has weights $w=[2,-3]$ and bias $b=4$ (score $=2x_1-3x_2+4$). Find the equation of the decision boundary as a line $x_2 = m\\,x_1 + c$.</p>`,
      steps:[
        {do:`Set the score to zero: $2x_1-3x_2+4=0$.`, why:`The boundary is exactly where the score is zero.`},
        {do:`Solve for $x_2$: $3x_2=2x_1+4$, so $x_2=\\tfrac{2}{3}x_1+\\tfrac{4}{3}$.`, why:`Rearrange into slope-intercept form.`},
        {do:`Slope $\\tfrac{2}{3}$, intercept $\\tfrac{4}{3}$.`, why:`These read directly off the line equation.`}
      ],
      answer:`$x_2=\\tfrac{2}{3}x_1+\\tfrac{4}{3}$` },

    { q:`<p>Two points lie on opposite sides of $w=[1,1]$, $b=-4$ (score $=x_1+x_2-4$): $A=[1,2]$ and $B=[3,3]$. Compute both signed distances using $\\text{dist}=\\dfrac{w\\cdot\\phi+b}{\\lVert w\\rVert}$ with $\\lVert w\\rVert=\\sqrt2$.</p>`,
      steps:[
        {do:`Scores: $A:1+2-4=-1$; $B:3+3-4=2$.`, why:`Evaluate the linear score at each point.`},
        {do:`Distances: $A:-1/\\sqrt2\\approx-0.71$; $B:2/\\sqrt2=\\sqrt2\\approx1.41$.`, why:`Divide the score by the weight-norm to get geometric distance.`},
        {do:`Opposite signs confirm opposite sides.`, why:`The sign of the signed distance names the side of the boundary.`}
      ],
      answer:`$A\\approx-0.71,\\ B\\approx1.41$` },

    { q:`<p>Feature map for nonlinearity: a raw point $x=3$ is lifted to $\\phi(x)=[1,x,x^2]=[1,3,9]$, with $w=[-5,0,1]$. Compute the score and prediction.</p>`,
      steps:[
        {do:`Score: $-5\\times1+0\\times3+1\\times9=-5+0+9=4$.`, why:`The quadratic feature lets a linear predictor draw a curved boundary in $x$.`},
        {do:`$\\text{sign}(4)=+1$, so $f_w(x)=+1$.`, why:`Positive score gives the "yes" class.`}
      ],
      answer:`$s=4,\\ f_w(x)=+1$` },

    { q:`<p>Multiclass by highest score. Three class weight vectors score an input $\\phi=[2,1]$: $w_{\\text{cat}}=[1,1]$, $w_{\\text{dog}}=[2,-1]$, $w_{\\text{fox}}=[0,3]$. Which class wins?</p>`,
      steps:[
        {do:`Scores: cat $=2+1=3$, dog $=4-1=3$, fox $=0+3=3$.`, why:`Each class scores the input with its own weights.`},
        {do:`All three tie at $3$.`, why:`The argmax is not unique here.`},
        {do:`A tie-break rule (e.g. lowest index) is needed; otherwise it is ambiguous.`, why:`Multiclass picks the highest-scoring class, breaking ties by convention.`}
      ],
      answer:`three-way tie at score $3$` },

    { q:`<p>Confidence and robustness. A point has score $s=0.2$, $y=+1$. A small input change shifts the score by $-0.5$. Does the prediction flip, and what does this say about margin?</p>`,
      steps:[
        {do:`New score $=0.2-0.5=-0.3$.`, why:`The perturbation pushes the score across zero.`},
        {do:`$\\text{sign}(-0.3)=-1\\ne+1$: the prediction flips to wrong.`, why:`A tiny margin sits close to the boundary.`},
        {do:`A larger margin would absorb such a shift without flipping.`, why:`Margin measures robustness to small input changes.`}
      ],
      answer:`flips to $-1$; small margins are fragile` },

    { q:`<p>Solve for a weight. With $\\phi=[2,3]$, weights $w=[w_1,2]$, we want score exactly $10$. Find $w_1$.</p>`,
      steps:[
        {do:`Score $=w_1\\times2+2\\times3=2w_1+6$.`, why:`Write the dot product as a function of the unknown.`},
        {do:`Set $2w_1+6=10\\Rightarrow2w_1=4$.`, why:`Match the desired score.`},
        {do:`$w_1=2$.`, why:`Divide both sides by $2$.`}
      ],
      answer:`$w_1=2$` },

    { q:`<p>Geometric margin vs functional margin. Point $\\phi=[3,4]$, $y=+1$, $w=[1,2]$ ($\\lVert w\\rVert=\\sqrt5$), $b=0$. Compute the functional margin $y(w\\cdot\\phi+b)$ and the geometric margin.</p>`,
      steps:[
        {do:`Functional: $w\\cdot\\phi+b=3+8=11$; times $y=+1$ gives $11$.`, why:`Functional margin is the raw signed score times the label.`},
        {do:`Geometric: $11/\\lVert w\\rVert=11/\\sqrt5\\approx4.92$.`, why:`Dividing by the norm gives distance from the boundary.`},
        {do:`Geometric margin is scale-invariant; functional is not.`, why:`Doubling $w$ doubles the functional margin but leaves the geometric margin unchanged.`}
      ],
      answer:`functional $11$, geometric $\\approx4.92$` },

    { q:`<p>Worst-case (minimum) margin selects which classifier is "safer". Classifier A's point margins are $\\{2,1,4\\}$; classifier B's are $\\{3,3,1.5\\}$. Both classify all points correctly. Which has the larger minimum margin?</p>`,
      steps:[
        {do:`A's minimum margin $=\\min(2,1,4)=1$.`, why:`The worst point defines the safety margin.`},
        {do:`B's minimum margin $=\\min(3,3,1.5)=1.5$.`, why:`Same rule for B.`},
        {do:`$1.5>1$, so B has the larger (safer) minimum margin.`, why:`Max-margin training prefers the larger smallest margin.`}
      ],
      answer:`B (min margin $1.5>1$)` },

    { q:`<p>Averaged perceptron idea. Over three updates the weight took values $w_1=[1,0]$, $w_2=[1,1]$, $w_3=[2,1]$. The averaged weight is the mean of these. Compute it.</p>`,
      steps:[
        {do:`Sum component-wise: $[1+1+2,\\ 0+1+1]=[4,2]$.`, why:`Averaging adds the snapshots then divides by their count.`},
        {do:`Divide by $3$: $[4/3,\\ 2/3]\\approx[1.33,0.67]$.`, why:`The averaged weight smooths out noisy late updates.`}
      ],
      answer:`$\\bar w=[4/3,2/3]\\approx[1.33,0.67]$` },

    { q:`<p>A point is exactly on the boundary: $\\phi=[2,2]$, $w=[1,-1]$, $b=0$. Compute the score and explain why $\\text{sign}(0)$ is a problem.</p>`,
      steps:[
        {do:`Score $=1\\times2+(-1)\\times2+0=0$.`, why:`The point lies exactly on the decision line.`},
        {do:`$\\text{sign}(0)$ is undefined (neither $+1$ nor $-1$).`, why:`A zero score gives no class; a tie-break convention must decide.`},
        {do:`The margin is $0$: maximally unconfident.`, why:`On-boundary points carry no classification confidence.`}
      ],
      answer:`$s=0$; sign undefined, margin $0$` },

    { q:`<p>Normalize features then classify. Raw $x=[40,2]$ is standardized to $\\phi=[(40-30)/10,\\ (2-1)/1]=[1,1]$ before applying $w=[2,3]$, $b=-1$. Compute the score on the standardized features.</p>`,
      steps:[
        {do:`Standardized features: $[(40-30)/10,(2-1)/1]=[1,1]$.`, why:`Subtract the mean and divide by the spread per feature.`},
        {do:`Score $=2\\times1+3\\times1-1=4$.`, why:`Apply the weights to the standardized vector.`},
        {do:`$\\text{sign}(4)=+1$.`, why:`Standardization keeps features on comparable scales so no feature dominates.`}
      ],
      answer:`$s=4,\\ f_w(x)=+1$` }
  ]);

  /* ===================== LOSS MINIMIZATION (harder, set 2) ===================== */
  add("ai-loss-minimization", [
    { q:`<p>Six examples with margins $m=3,\\ 0,\\ -2,\\ 1,\\ 0.4,\\ 1.5$. Compute the average hinge loss.</p>`,
      steps:[
        {do:`Hinge $\\max(1-m,0)$: $0,\\ 1,\\ 3,\\ 0,\\ 0.6,\\ 0$.`, why:`Only margins below $1$ incur a positive hinge penalty.`},
        {do:`Sum: $0+1+3+0+0.6+0=4.6$.`, why:`Train loss totals the per-example losses.`},
        {do:`Average: $4.6/6\\approx0.767$.`, why:`Divide by $|D|=6$.`}
      ],
      answer:`$4.6/6\\approx0.767$` },

    { q:`<p>Regularized objective $J(w)=\\text{TrainLoss}(w)+\\tfrac{\\lambda}{2}\\lVert w\\rVert^2$. With train loss $0.8$, $\\lambda=0.1$, $w=[3,4]$ ($\\lVert w\\rVert^2=25$), compute $J$.</p>`,
      steps:[
        {do:`Regularizer: $\\tfrac{0.1}{2}\\times25=0.05\\times25=1.25$.`, why:`The L2 penalty discourages large weights.`},
        {do:`$J=0.8+1.25=2.05$.`, why:`Add the data-fit loss and the regularization penalty.`}
      ],
      answer:`$J=2.05$` },

    { q:`<p>How does $\\lambda$ trade off fit vs simplicity? Same train loss $0.8$ and $\\lVert w\\rVert^2=25$, but now $\\lambda=1$. Compute $J$ and compare to $\\lambda=0.1$ ($J=2.05$).</p>`,
      steps:[
        {do:`Regularizer: $\\tfrac{1}{2}\\times25=12.5$.`, why:`A larger $\\lambda$ weights the penalty more heavily.`},
        {do:`$J=0.8+12.5=13.3$.`, why:`Add data loss and the bigger penalty.`},
        {do:`$13.3\\gg2.05$, so large $\\lambda$ punishes complex weights harder.`, why:`Higher $\\lambda$ pushes toward smaller, simpler weights even at some fit cost.`}
      ],
      answer:`$J=13.3$; larger $\\lambda$ favors simplicity` },

    { q:`<p>Logistic loss $\\log(1+e^{-m})$ averaged over two examples with margins $m=0$ and $m=1$. Use $\\log$ base $e$; $e^{-1}\\approx0.368$.</p>`,
      steps:[
        {do:`At $m=0$: $\\log(1+e^{0})=\\log2\\approx0.693$.`, why:`A zero margin gives a moderate logistic penalty.`},
        {do:`At $m=1$: $\\log(1+0.368)=\\log(1.368)\\approx0.313$.`, why:`A larger margin lowers the loss but never to exactly zero.`},
        {do:`Average $\\approx(0.693+0.313)/2=0.503$.`, why:`Train loss is the mean of per-example losses.`}
      ],
      answer:`$\\approx0.503$` },

    { q:`<p>Squared loss on three regression points: predictions $\\hat y=[2,5,1]$, targets $y=[0,4,3]$. Compute the mean squared error.</p>`,
      steps:[
        {do:`Errors: $2-0=2$, $5-4=1$, $1-3=-2$.`, why:`The residual is prediction minus target.`},
        {do:`Squared: $4,\\ 1,\\ 4$; sum $=9$.`, why:`Square each residual and add.`},
        {do:`MSE $=9/3=3$.`, why:`Average the squared errors over $|D|=3$.`}
      ],
      answer:`MSE $=3$` },

    { q:`<p>Absolute (L1) loss $|\\hat y-y|$ vs squared loss on a single outlier: $\\hat y=1$, $y=11$. Compute both and say which punishes outliers harder.</p>`,
      steps:[
        {do:`Residual $=1-11=-10$, $|{-10}|=10$.`, why:`L1 loss is the absolute residual.`},
        {do:`Squared $=(-10)^2=100$.`, why:`Squaring amplifies large errors.`},
        {do:`$100\\gg10$, so squared loss punishes the outlier far harder.`, why:`L2 is sensitive to outliers; L1 is more robust.`}
      ],
      answer:`L1 $=10$, L2 $=100$; squared hits outliers harder` },

    { q:`<p>Full pipeline. $\\phi=[1,3]$ (first is bias), $w=[-1,1]$, $y=-1$. Compute score, margin, then both zero-one and hinge loss.</p>`,
      steps:[
        {do:`Score $=-1\\times1+1\\times3=2$; margin $m=2\\times(-1)=-2$.`, why:`Score times label; negative means a mistake.`},
        {do:`Zero-one: prediction sign $+1\\ne y=-1$, so loss $=1$.`, why:`A wrong prediction costs one.`},
        {do:`Hinge: $\\max(1-(-2),0)=\\max(3,0)=3$.`, why:`A negative margin yields a large hinge penalty.`}
      ],
      answer:`$m=-2$; zero-one $1$, hinge $3$` },

    { q:`<p>Class imbalance with weighted loss. $9$ negatives each loss $0.1$ and $1$ positive with loss $2$, but the positive is weighted $\\times5$. Compute the weighted average loss over the effective weight total.</p>`,
      steps:[
        {do:`Weighted losses: negatives $9\\times(1\\times0.1)=0.9$; positive $5\\times2=10$.`, why:`Each example's loss is scaled by its weight.`},
        {do:`Total weight $=9\\times1+5=14$.`, why:`Sum the weights, not just the counts.`},
        {do:`Weighted average $=(0.9+10)/14=10.9/14\\approx0.779$.`, why:`Divide weighted loss by total weight, so the rare positive matters more.`}
      ],
      answer:`$\\approx0.779$` },

    { q:`<p>Convexity intuition. Hinge $\\max(1-m,0)$ is convex; zero-one is not. Evaluate hinge at $m=-1,0,1$ and confirm it never curves the wrong way (no dip between).</p>`,
      steps:[
        {do:`Values: $m=-1\\to2$, $m=0\\to1$, $m=1\\to0$.`, why:`Plug each margin into the hinge.`},
        {do:`The values decrease steadily $2,1,0$ with no rise in between.`, why:`Convex losses have a single bowl shape, easy for gradient descent.`},
        {do:`So minimizing hinge has no spurious local traps from its shape.`, why:`Convexity guarantees a gradient method can reach the global minimum.`}
      ],
      answer:`$2,1,0$; convex, no wrong-way curve` },

    { q:`<p>Gradient direction of hinge. For $m<1$, the per-example hinge gradient is $-y\\,\\phi$. With $\\phi=[2,1]$, $y=+1$, give the gradient and which way $w$ moves under descent.</p>`,
      steps:[
        {do:`Gradient $=-y\\,\\phi=-1\\times[2,1]=[-2,-1]$.`, why:`This is the hinge gradient while the margin is below $1$.`},
        {do:`Descent step subtracts it: $w$ moves by $+[2,1]\\eta$.`, why:`Subtracting a negative gradient increases the score on this point.`},
        {do:`So $w$ shifts to raise this example's margin.`, why:`Gradient descent reduces the hinge by pushing the margin past $1$.`}
      ],
      answer:`gradient $[-2,-1]$; $w$ moves toward $+[2,1]$` },

    { q:`<p>Compare three loss values at a confidently wrong point $m=-3$: zero-one, hinge, and squared-margin $(1-m)^2$. Rank them.</p>`,
      steps:[
        {do:`Zero-one $=1$ (just a mistake flag).`, why:`Zero-one caps at $1$ regardless of how wrong.`},
        {do:`Hinge $=\\max(1-(-3),0)=4$.`, why:`Hinge grows linearly with how negative the margin is.`},
        {do:`Squared $(1-(-3))^2=16$.`, why:`Squared grows quadratically.`}
      ],
      answer:`zero-one $1$ < hinge $4$ < squared $16$` },

    { q:`<p>Training loss as a function of one weight. With one feature $\\phi=1$, two examples both $y=+1$, loss $=\\max(1-w,0)$ each (since $m=w$). Find the train loss at $w=0$, $w=1$, and the smallest $w$ that makes it zero.</p>`,
      steps:[
        {do:`At $w=0$: each $\\max(1,0)=1$, average $=1$.`, why:`Both margins are $0$, deep in the penalty region.`},
        {do:`At $w=1$: each $\\max(0,0)=0$, average $=0$.`, why:`Margin reaches $1$, clearing the hinge.`},
        {do:`Smallest zero-loss weight is $w=1$.`, why:`The hinge becomes zero exactly when the margin hits $1$.`}
      ],
      answer:`loss $1$ at $w=0$, $0$ at $w=1$; threshold $w=1$` },

    { q:`<p>Decompose total loss into per-class contributions. Positives have average loss $0.6$ (count $4$); negatives average $0.2$ (count $6$). Compute the overall average loss.</p>`,
      steps:[
        {do:`Positive total $=4\\times0.6=2.4$; negative total $=6\\times0.2=1.2$.`, why:`Convert averages back to summed losses.`},
        {do:`Grand total $=2.4+1.2=3.6$ over $10$ examples.`, why:`Add both class totals.`},
        {do:`Overall average $=3.6/10=0.36$.`, why:`Divide by the full dataset size.`}
      ],
      answer:`$0.36$` }
  ]);

  /* ===================== SGD (harder, set 2) ===================== */
  add("ai-sgd", [
    { q:`<p>Three SGD steps on a scalar. $w=8$, $\\eta=0.5$. Gradients in order: $4,\\ 2,\\ -2$. Give $w$ after each step.</p>`,
      steps:[
        {do:`Step 1: $8-0.5\\times4=6$.`, why:`Each step moves against that example's gradient.`},
        {do:`Step 2: $6-0.5\\times2=5$.`, why:`Use the updated weight and next gradient.`},
        {do:`Step 3: $5-0.5\\times(-2)=5+1=6$.`, why:`A negative gradient adds to the weight.`}
      ],
      answer:`$w=6\\to5\\to6$` },

    { q:`<p>Decaying learning rate $\\eta_t=1/t$. $w=10$, gradient $4$ every step. Compute $w$ after steps $t=1,2,3$.</p>`,
      steps:[
        {do:`$t=1$: $\\eta=1$, $w=10-1\\times4=6$.`, why:`The first step is the largest.`},
        {do:`$t=2$: $\\eta=0.5$, $w=6-0.5\\times4=4$.`, why:`The step size shrinks as $t$ grows.`},
        {do:`$t=3$: $\\eta=1/3$, $w=4-\\tfrac13\\times4\\approx2.67$.`, why:`Decaying $\\eta$ helps SGD settle near the minimum.`}
      ],
      answer:`$w=6\\to4\\to\\approx2.67$` },

    { q:`<p>Two epochs over the same single example. Squared-loss gradient $\\nabla=2(\\hat y-y)\\phi$ with $\\phi=1$, $y=4$, $\\eta=0.1$, start $w=10$ (so $\\hat y=w$). Compute $w$ after two updates.</p>`,
      steps:[
        {do:`Update 1: $\\hat y=10$, error $6$, $\\nabla=2\\times6\\times1=12$; $w=10-0.1\\times12=8.8$.`, why:`The gradient shrinks as the prediction approaches the target.`},
        {do:`Update 2: $\\hat y=8.8$, error $4.8$, $\\nabla=9.6$; $w=8.8-0.1\\times9.6=7.84$.`, why:`Recompute with the new prediction.`},
        {do:`$w$ marches toward the target $4$.`, why:`Repeated SGD steps drive the squared loss down.`}
      ],
      answer:`$w=8.8\\to7.84$` },

    { q:`<p>Mini-batch SGD averages the gradient over the batch. A batch of three has per-example gradients $[2,4]$, $[0,2]$, $[4,0]$. With $w=[5,5]$, $\\eta=0.5$, do one batch update.</p>`,
      steps:[
        {do:`Average gradient $=\\tfrac13([2,4]+[0,2]+[4,0])=\\tfrac13[6,6]=[2,2]$.`, why:`Mini-batch uses the mean gradient over the batch.`},
        {do:`$w\\leftarrow[5,5]-0.5\\times[2,2]=[4,4]$.`, why:`Step against the averaged gradient.`}
      ],
      answer:`$w=[4,4]$` },

    { q:`<p>L2-regularized SGD. The update is $w\\leftarrow w-\\eta(\\nabla_{\\text{loss}}+\\lambda w)$. With $w=[4,2]$, $\\nabla_{\\text{loss}}=[2,0]$, $\\lambda=0.5$, $\\eta=0.1$, do one step.</p>`,
      steps:[
        {do:`Regularization term $\\lambda w=0.5\\times[4,2]=[2,1]$.`, why:`L2 adds a pull toward zero proportional to $w$.`},
        {do:`Total gradient $=[2,0]+[2,1]=[4,1]$.`, why:`Combine the loss gradient and the weight-decay term.`},
        {do:`$w\\leftarrow[4,2]-0.1\\times[4,1]=[3.6,1.9]$.`, why:`Step against the combined gradient.`}
      ],
      answer:`$w=[3.6,1.9]$` },

    { q:`<p>Momentum SGD. Velocity $v\\leftarrow\\beta v-\\eta\\nabla$, then $w\\leftarrow w+v$. Start $v=0$, $w=10$, $\\beta=0.9$, $\\eta=1$, gradient $2$ on both steps. Find $w$ after two steps.</p>`,
      steps:[
        {do:`Step 1: $v=0.9\\times0-1\\times2=-2$; $w=10+(-2)=8$.`, why:`Velocity accumulates the negative gradient.`},
        {do:`Step 2: $v=0.9\\times(-2)-1\\times2=-1.8-2=-3.8$; $w=8-3.8=4.2$.`, why:`Momentum builds speed in a consistent direction.`},
        {do:`The second step is bigger than the first.`, why:`Momentum accelerates descent along persistent gradients.`}
      ],
      answer:`$w=8\\to4.2$` },

    { q:`<p>Learning-rate too large diverges. $f(w)=w^2$, gradient $2w$, start $w=1$, $\\eta=1.5$. Compute $w$ after two steps and describe the trend.</p>`,
      steps:[
        {do:`Step 1: $w=1-1.5\\times(2\\times1)=1-3=-2$.`, why:`The step overshoots past the minimum at $0$.`},
        {do:`Step 2: $w=-2-1.5\\times(2\\times-2)=-2+6=4$.`, why:`It overshoots again, even farther out.`},
        {do:`$|w|$ grows $1\\to2\\to4$: the iteration diverges.`, why:`Too large an $\\eta$ makes the loss explode instead of shrink.`}
      ],
      answer:`$w=-2\\to4$; diverges` },

    { q:`<p>Compare convergence speed. With gradient $2w$ on $f=w^2$ from $w=1$, one step at the optimal $\\eta=0.5$ lands exactly on the minimum. Show it.</p>`,
      steps:[
        {do:`$w=1-0.5\\times(2\\times1)=1-1=0$.`, why:`For $f=w^2$, $\\eta=1/2$ jumps straight to the minimum.`},
        {do:`At $w=0$ the gradient is $0$, so no further movement.`, why:`The optimal step size reaches the minimum in one shot here.`}
      ],
      answer:`$w=0$ in one step` },

    { q:`<p>Perceptron update (a special SGD). On a misclassified point ($y=+1$, current $w=[0,1]$, $\\phi=[2,-1]$), the rule is $w\\leftarrow w+y\\phi$. Verify it is misclassified, then update.</p>`,
      steps:[
        {do:`Score $=0\\times2+1\\times(-1)=-1$; sign $-1\\ne y=+1$: misclassified.`, why:`The perceptron only updates on mistakes.`},
        {do:`$w\\leftarrow[0,1]+1\\times[2,-1]=[2,0]$.`, why:`Add $y\\phi$ to push toward correct classification.`},
        {do:`New score $=2\\times2+0\\times(-1)=4>0$: now correct.`, why:`The single update fixes this example.`}
      ],
      answer:`$w=[2,0]$, now correctly classified` },

    { q:`<p>Average two per-example gradients then step once vs step twice individually — show they differ. $w=10$, $\\eta=0.5$, gradients $g_1=4$ (at $w=10$), $g_2=2$ (fixed). Batch update vs two sequential updates.</p>`,
      steps:[
        {do:`Batch: avg $=(4+2)/2=3$; $w=10-0.5\\times3=8.5$.`, why:`A mini-batch averages then takes one step.`},
        {do:`Sequential: $w=10-0.5\\times4=8$, then $8-0.5\\times2=7$.`, why:`Pure SGD steps after each example.`},
        {do:`$8.5\\ne7$: sequential steps move farther here.`, why:`Order and batching change the trajectory, though both reduce loss.`}
      ],
      answer:`batch $8.5$ vs sequential $7$` },

    { q:`<p>Sign of progress. Loss $L(w)=(w-3)^2$. At $w=5$ compute the gradient and one SGD step with $\\eta=0.25$; confirm the loss decreased.</p>`,
      steps:[
        {do:`Gradient $=2(w-3)=2\\times2=4$; step $w=5-0.25\\times4=4$.`, why:`Move against the gradient toward the minimum at $3$.`},
        {do:`Loss before $=(5-3)^2=4$; after $=(4-3)^2=1$.`, why:`Compare the loss at old and new weights.`},
        {do:`$1<4$: the loss dropped.`, why:`A correctly sized gradient step lowers the loss.`}
      ],
      answer:`$w=4$; loss $4\\to1$` },

    { q:`<p>Vector SGD with three sequential examples. $w=[6,6,6]$, $\\eta=0.5$. Gradients: $[2,0,0]$, $[0,2,0]$, $[0,0,2]$. Final $w$?</p>`,
      steps:[
        {do:`After 1: $[6-1,6,6]=[5,6,6]$.`, why:`Only the first component has a nonzero gradient.`},
        {do:`After 2: $[5,6-1,6]=[5,5,6]$.`, why:`Second example touches only the second component.`},
        {do:`After 3: $[5,5,6-1]=[5,5,5]$.`, why:`Each example nudges a different coordinate.`}
      ],
      answer:`$w=[5,5,5]$` }
  ]);

  /* ===================== SEARCH PROBLEM (harder, set 2) ===================== */
  add("ai-search-problem", [
    { q:`<p>Directed graph, edge costs: $S\\to A=2$, $S\\to B=3$, $A\\to C=2$, $B\\to C=1$, $A\\to D=7$, $C\\to D=2$. Enumerate all simple $S\\to D$ paths with costs and give the cheapest.</p>`,
      steps:[
        {do:`$S\\to A\\to D=2+7=9$.`, why:`Sum edge costs along each path.`},
        {do:`$S\\to A\\to C\\to D=2+2+2=6$; $S\\to B\\to C\\to D=3+1+2=6$.`, why:`Two routes go through $C$.`},
        {do:`Cheapest $=\\min(9,6,6)=6$.`, why:`Search returns the minimum-cost path.`}
      ],
      answer:`paths $9,6,6$; cheapest $6$` },

    { q:`<p>8-puzzle style. State is a permutation; an action swaps the blank with a neighbor, cost $1$. If the blank can move in $3$ directions from a state, how many successors, and what is the cost of a $12$-move solution?</p>`,
      steps:[
        {do:`Each legal blank move is one action with one successor.`, why:`$\\text{Succ}(s,a)$ returns one next state per action.`},
        {do:`Three legal moves $\\Rightarrow3$ successors.`, why:`Count the available actions from that state.`},
        {do:`A $12$-move solution costs $12\\times1=12$.`, why:`Unit-cost moves make path cost equal to move count.`}
      ],
      answer:`$3$ successors; solution cost $12$` },

    { q:`<p>Robot on a $2$D grid at $(0,0)$, goal $(3,2)$. Moves: up/down/left/right, each cost $1$ (no diagonals, no walls). What is the minimum path cost?</p>`,
      steps:[
        {do:`Need net $+3$ in $x$ and $+2$ in $y$.`, why:`Each axis must be covered by single-step moves.`},
        {do:`Minimum moves $=3+2=5$, each cost $1$.`, why:`Manhattan distance is the fewest unit moves.`},
        {do:`Total cost $=5$.`, why:`Any detour only adds cost.`}
      ],
      answer:`$5$` },

    { q:`<p>State explosion. A vacuum world has $n=4$ rooms, each clean or dirty, plus the robot's location (one of $4$). How many distinct states are there?</p>`,
      steps:[
        {do:`Dirt configurations: $2^4=16$.`, why:`Each room is independently clean or dirty.`},
        {do:`Robot locations: $4$.`, why:`The robot occupies one of the four rooms.`},
        {do:`Total states $=16\\times4=64$.`, why:`Multiply independent state components.`}
      ],
      answer:`$64$ states` },

    { q:`<p>Costs as travel time. Route through highway: edges $10,5,8$ minutes. Route through city: edges $4,4,4,4$ minutes. Which is faster and by how much?</p>`,
      steps:[
        {do:`Highway $=10+5+8=23$.`, why:`Path cost sums its edges.`},
        {do:`City $=4\\times4=16$.`, why:`Four equal edges.`},
        {do:`City is faster by $23-16=7$ minutes.`, why:`Lower total cost wins; report the difference.`}
      ],
      answer:`city, by $7$ minutes` },

    { q:`<p>Word-ladder search. From "cat", an action changes one letter to make a valid word, cost $1$. If "cat"$\\to$"cot"$\\to$"cog"$\\to$"dog" is the shortest chain, what is the path cost?</p>`,
      steps:[
        {do:`Count the single-letter changes: cat$\\to$cot$\\to$cog$\\to$dog is $3$ steps.`, why:`Each edge is one valid one-letter change.`},
        {do:`Each step costs $1$, so total $=3$.`, why:`Unit-cost edges sum to the number of steps.`}
      ],
      answer:`$3$` },

    { q:`<p>Reverse search. Goal-test is "reach $0$" from start $20$. Actions: subtract $1$ (cost $1$) or halve if even (cost $2$). Cheapest cost from $20$ to $0$? (Hint: $20\\to10\\to5\\to4\\to2\\to1\\to0$.)</p>`,
      steps:[
        {do:`$20\\to10$ halve (2), $10\\to5$ halve (2), $5\\to4$ sub (1).`, why:`Halving even numbers cuts the value fast at cost $2$.`},
        {do:`$4\\to2$ halve (2), $2\\to1$ halve (2), $1\\to0$ sub (1).`, why:`Continue toward $0$.`},
        {do:`Total $=2+2+1+2+2+1=10$.`, why:`Sum the action costs along the chosen path.`}
      ],
      answer:`$10$` },

    { q:`<p>Why is a search problem's "state" not the same as a "node"? A node also records the path and cost. If two paths $S\\to A\\to C$ ($cost\\,5$) and $S\\to B\\to C$ ($cost\\,3$) reach state $C$, how many states and how many nodes are involved at $C$?</p>`,
      steps:[
        {do:`Both paths end in the same state $C$: one state.`, why:`A state is a configuration of the world, independent of how reached.`},
        {do:`But there are two nodes (one per path/cost).`, why:`A node bundles a state with its path and cost.`},
        {do:`Graph search keeps the cheaper node ($cost\\,3$).`, why:`Only the minimum-cost way to a state matters.`}
      ],
      answer:`$1$ state, $2$ nodes; keep cost $3$` },

    { q:`<p>Branching with costs. From start, $3$ actions cost $1,2,3$ and lead to states with future costs $6,4,2$. Which action starts the cheapest plan?</p>`,
      steps:[
        {do:`Action totals: $1+6=7$, $2+4=6$, $3+2=5$.`, why:`Cost now plus future cost from where it leads.`},
        {do:`Minimum $=5$ from the third action.`, why:`Search picks the action beginning the cheapest path.`}
      ],
      answer:`third action (total $5$)` },

    { q:`<p>Modular arithmetic state space. From $0$, "add 4" (cost 1) modulo $7$. List the states reached and the cheapest cost to reach state $5$.</p>`,
      steps:[
        {do:`Reachable: $0\\to4\\to(8\\bmod7=1)\\to5$.`, why:`Repeatedly add $4$ mod $7$.`},
        {do:`That is $3$ actions: $0\\to4\\to1\\to5$.`, why:`Each "add 4" is one cost-$1$ step.`},
        {do:`Cheapest cost to $5$ is $3$.`, why:`No shorter chain of $+4$ mod $7$ reaches $5$.`}
      ],
      answer:`$3$ (via $0,4,1,5$)` },

    { q:`<p>Cost that depends on the action, not uniform. From $A$: "fast" $\\to B$ cost $5$, "slow" $\\to B$ cost $2$. From $B$ to goal cost $1$. Cheapest $A\\to$goal?</p>`,
      steps:[
        {do:`Via fast: $5+1=6$.`, why:`Sum the action costs.`},
        {do:`Via slow: $2+1=3$.`, why:`The cheaper action to $B$ wins.`},
        {do:`Cheapest $=\\min(6,3)=3$.`, why:`Both reach $B$; take the lower-cost edge.`}
      ],
      answer:`$3$ (slow then to goal)` },

    { q:`<p>Infinite state space needs care. From $1$, "add 1" cost $1$ with no upper bound. The goal is "reach a prime $>10$". What is the cheapest cost? (Hint: $11$ is the first prime above $10$.)</p>`,
      steps:[
        {do:`First prime above $10$ is $11$.`, why:`The goal test fires at the nearest qualifying state.`},
        {do:`From $1$ to $11$ takes $10$ "add 1" steps.`, why:`Each step costs $1$ and increments by one.`},
        {do:`Cheapest cost $=10$.`, why:`Reaching $11$ is the closest goal state.`}
      ],
      answer:`$10$` }
  ]);

  /* ===================== TREE SEARCH (harder, set 2) ===================== */
  add("ai-tree-search", [
    { q:`<p>Total nodes in a full $b=3$ tree of depth $d=3$ (levels $0..3$). Use $\\sum_{i=0}^{d}b^i=\\dfrac{b^{d+1}-1}{b-1}$.</p>`,
      steps:[
        {do:`$\\dfrac{3^{4}-1}{3-1}=\\dfrac{81-1}{2}$.`, why:`Apply the geometric-series formula with $b=3$, $d=3$.`},
        {do:`$=80/2=40$.`, why:`Compute the closed form.`}
      ],
      answer:`$40$ nodes` },

    { q:`<p>BFS with goal at depth $d=2$, $b=2$, full tree. In the worst case BFS expands the whole tree up to and including depth $2$. How many nodes does it expand?</p>`,
      steps:[
        {do:`Nodes through depth $2$: $1+2+4=7$.`, why:`BFS may expand every node down to the goal's depth.`},
        {do:`So worst-case BFS expands $7$ nodes.`, why:`The goal could be the last node at depth $2$.`}
      ],
      answer:`$7$ nodes` },

    { q:`<p>DFS memory vs BFS memory concretely. $b=10$, $d=5$. Give the rough node counts each must hold: BFS frontier $\\approx b^d$, DFS path $\\approx d$.</p>`,
      steps:[
        {do:`BFS frontier $\\approx10^5=100{,}000$ nodes.`, why:`BFS stores an entire level.`},
        {do:`DFS path $\\approx5$ nodes.`, why:`DFS holds only the current root-to-leaf path.`},
        {do:`DFS uses about $20{,}000\\times$ less memory here.`, why:`The $b^d$ vs $d$ gap is enormous for large $b,d$.`}
      ],
      answer:`BFS $\\approx10^5$, DFS $\\approx5$` },

    { q:`<p>IDDFS total work for $b=2$, goal depth $d=3$. Each limit $L$ pass visits $2^{0}+\\dots+2^{L}=2^{L+1}-1$. Sum over $L=0,1,2,3$.</p>`,
      steps:[
        {do:`Passes: $1,\\ 3,\\ 7,\\ 15$ for $L=0,1,2,3$.`, why:`Each pass re-explores from the root to depth $L$.`},
        {do:`Total $=1+3+7+15=26$ node-visits.`, why:`IDDFS sums the work across all passes.`},
        {do:`Single BFS to depth $3$ visits $15$.`, why:`IDDFS does about $1.7\\times$ the work but keeps $\\mathcal{O}(d)$ memory.`}
      ],
      answer:`$26$ visits (vs $15$ for BFS)` },

    { q:`<p>DFS can loop forever without cycle checking. Graph $A\\to B\\to A$ (a cycle). Why does tree-style DFS not terminate, and what fixes it?</p>`,
      steps:[
        {do:`DFS goes $A,B,A,B,\\dots$ revisiting the cycle endlessly.`, why:`Tree search has no memory of visited states.`},
        {do:`A visited set (graph search) stops re-expanding $A$.`, why:`Marking states prevents infinite loops.`},
        {do:`Or a depth limit bounds the descent.`, why:`Either cycle detection or a depth cap guarantees termination.`}
      ],
      answer:`cycle causes infinite descent; fix with visited set or depth limit` },

    { q:`<p>Completeness comparison. On an infinite-depth tree with a finite-depth goal, which of BFS and DFS is guaranteed to find the goal, and why?</p>`,
      steps:[
        {do:`BFS explores level by level, reaching any finite depth eventually.`, why:`BFS is complete: it will find a shallow goal.`},
        {do:`DFS may dive down an infinite branch and never return.`, why:`DFS is not complete on infinite-depth trees.`},
        {do:`So BFS is guaranteed; DFS is not.`, why:`Bounded breadth beats unbounded depth here.`}
      ],
      answer:`BFS (complete); DFS may never find it` },

    { q:`<p>Optimality with edge costs. BFS finds the shallowest goal. If edge costs vary ($1,1,5$ along one path vs $2,2$ along another), can BFS guarantee the cheapest path? Explain.</p>`,
      steps:[
        {do:`BFS counts steps, not cost: it returns the fewest-edge path.`, why:`BFS optimizes depth, not total cost.`},
        {do:`A $2$-edge path costing $5+1=6$ may beat a $1$-edge path costing $7$.`, why:`Fewest edges is not the same as least cost.`},
        {do:`So BFS is only optimal when all edge costs are equal.`, why:`For varying costs you need UCS, not BFS.`}
      ],
      answer:`no; BFS is optimal only for uniform edge costs` },

    { q:`<p>Effective branching factor. A search expands $N=124$ nodes to reach depth $d=4$. The effective branching factor $b^*$ solves $1+b^*+\\dots+(b^*)^4=N$. Test $b^*=3$: does it match?</p>`,
      steps:[
        {do:`At $b^*=3$: $\\dfrac{3^5-1}{3-1}=\\dfrac{242}{2}=121$.`, why:`Sum the geometric series for $b^*=3$, $d=4$.`},
        {do:`$121\\approx124$, very close.`, why:`The effective branching factor summarizes search efficiency.`},
        {do:`So $b^*\\approx3$.`, why:`A smaller $b^*$ means a more focused search.`}
      ],
      answer:`$b^*\\approx3$ (gives $121\\approx124$)` },

    { q:`<p>Goal on the last branch. $b=2$, $d=3$, goal is the rightmost leaf. How many nodes does DFS (left-first) expand before finding it, counting the goal?</p>`,
      steps:[
        {do:`DFS explores the entire tree left-to-right before the rightmost leaf.`, why:`The goal is the last node visited.`},
        {do:`Total nodes through depth $3$: $1+2+4+8=15$.`, why:`A full binary tree of depth $3$ has $15$ nodes.`},
        {do:`DFS expands all $15$.`, why:`Worst case for DFS is the goal on the final branch.`}
      ],
      answer:`$15$ nodes` },

    { q:`<p>Memory of IDDFS. For $b=2$, the deepest pass to limit $L$ stores at most $\\mathcal{O}(L)$ nodes. At $L=10$, give the order of memory and compare to BFS's frontier $2^{10}$.</p>`,
      steps:[
        {do:`IDDFS memory $\\approx\\mathcal{O}(10)$ nodes.`, why:`Each pass is a depth-limited DFS holding one path.`},
        {do:`BFS frontier $\\approx2^{10}=1024$ nodes.`, why:`BFS stores a full level at depth $10$.`},
        {do:`IDDFS uses about $100\\times$ less memory.`, why:`IDDFS trades a little repeated work for huge memory savings.`}
      ],
      answer:`IDDFS $\\mathcal{O}(10)$ vs BFS $1024$` },

    { q:`<p>Bidirectional search. Two BFS frontiers grow from start and goal, meeting in the middle. For $b=2$, $d=6$, one-directional cost $\\approx2^6$; bidirectional $\\approx2\\times2^{3}$. Compute both.</p>`,
      steps:[
        {do:`One-directional $\\approx2^6=64$.`, why:`A single BFS explores to full depth $6$.`},
        {do:`Bidirectional $\\approx2\\times2^{3}=2\\times8=16$.`, why:`Each frontier only needs depth $3$ before they meet.`},
        {do:`$16<64$: bidirectional explores far fewer nodes.`, why:`Meeting in the middle halves the effective depth.`}
      ],
      answer:`$64$ vs $16$; bidirectional is cheaper` },

    { q:`<p>Time blowup tipping point. $b=10$. Going from $d=4$ to $d=6$ multiplies the deepest level by how much, and from $10^4$ to what value?</p>`,
      steps:[
        {do:`Multiplier $=b^{6-4}=10^2=100$.`, why:`Each extra level multiplies the count by $b$.`},
        {do:`Deepest level: $10^4=10{,}000\\to10^6=1{,}000{,}000$.`, why:`Two more levels means $100\\times$ more nodes.`},
        {do:`This exponential growth motivates heuristics.`, why:`A* and pruning fight the $b^d$ explosion.`}
      ],
      answer:`$\\times100$; $10^4\\to10^6$` }
  ]);

  /* ===================== GRAPH SEARCH / UCS (harder, set 2) ===================== */
  add("ai-graph-search", [
    { q:`<p>UCS on a $6$-node graph (undirected): $S\\!-\\!A=2$, $S\\!-\\!B=5$, $A\\!-\\!B=1$, $A\\!-\\!C=4$, $B\\!-\\!C=1$, $B\\!-\\!D=3$, $C\\!-\\!D=1$, $D\\!-\\!G=2$. Trace the settle order and the cost to $G$.</p>`,
      steps:[
        {do:`Settle $S(0)$; frontier $A=2,B=5$. Settle $A(2)$; relax $B=\\min(5,2+1)=3$, $C=2+4=6$.`, why:`UCS pops the cheapest node and relaxes neighbours.`},
        {do:`Settle $B(3)$; relax $C=\\min(6,3+1)=4$, $D=3+3=6$. Settle $C(4)$; relax $D=\\min(6,4+1)=5$.`, why:`The path $S\\to A\\to B\\to C$ undercuts direct edges.`},
        {do:`Settle $D(5)$; relax $G=5+2=7$. Settle $G(7)$.`, why:`$G$ is popped at its final cheapest cost.`}
      ],
      answer:`order $S,A,B,C,D,G$; cost $7$` },

    { q:`<p>Same graph. What is the cheapest $S\\to D$ cost and the path achieving it?</p>`,
      steps:[
        {do:`Via $B$ direct: $S\\to A\\to B\\to D=2+1+3=6$.`, why:`One candidate route.`},
        {do:`Via $C$: $S\\to A\\to B\\to C\\to D=2+1+1+1=5$.`, why:`Routing through $C$ saves cost.`},
        {do:`$\\min(6,5)=5$ via $S,A,B,C,D$.`, why:`UCS settles $D$ at its minimum.`}
      ],
      answer:`$5$ via $S,A,B,C,D$` },

    { q:`<p>DP on a DAG with multiple goals. $\\text{FutureCost}=0$ at terminals $G_1,G_2$. Edges: $C\\to G_1=4$, $C\\to G_2=1$, $B\\to C=2$, $A\\to B=3$, $A\\to C=6$. Compute $FC(C),FC(B),FC(A)$.</p>`,
      steps:[
        {do:`$FC(C)=\\min(4+0,\\ 1+0)=1$.`, why:`From $C$, head to the cheaper goal $G_2$.`},
        {do:`$FC(B)=2+FC(C)=2+1=3$.`, why:`$B$'s only action leads to $C$.`},
        {do:`$FC(A)=\\min(3+FC(B),\\ 6+FC(C))=\\min(6,7)=6$.`, why:`Take the cheaper of $A$'s two actions.`}
      ],
      answer:`$FC: C=1,B=3,A=6$` },

    { q:`<p>Dijkstra with a priority queue: ties and re-relaxation. Frontier $\\{A:4,B:4,C:7\\}$, and popping $A$ relaxes $C$ via edge $A\\!-\\!C=2$. Give the new frontier and which node is popped next.</p>`,
      steps:[
        {do:`Pop $A$ (tie with $B$ at $4$, choose $A$). Relax $C$: $4+2=6<7$.`, why:`A cheaper path through $A$ improves $C$.`},
        {do:`Frontier $\\{B:4,\\ C:6\\}$.`, why:`$A$ is settled; $C$ dropped to $6$.`},
        {do:`Next pop is $B$ at $4$.`, why:`$B$ now has the smallest key.`}
      ],
      answer:`$\\{B:4,C:6\\}$; pop $B$ next` },

    { q:`<p>UCS vs BFS optimality. Path $S\\to A\\to G$ has edges $1,1$ (cost $2$, $2$ edges); path $S\\to G$ has one edge cost $3$. Which does UCS return, and which does BFS return?</p>`,
      steps:[
        {do:`UCS compares total cost: $2<3$, returns $S\\to A\\to G$.`, why:`UCS minimizes total path cost.`},
        {do:`BFS counts edges: $1<2$, returns the direct $S\\to G$ at cost $3$.`, why:`BFS minimizes number of edges, ignoring cost.`},
        {do:`UCS finds the cheaper plan; BFS does not.`, why:`Only UCS is cost-optimal with varying edge weights.`}
      ],
      answer:`UCS: cost $2$ path; BFS: cost $3$ path` },

    { q:`<p>Bellman-style DP layering. Costs in a $3$-layer DAG: layer 1 nodes $X,Y$ from $S$ cost $2,5$; layer 2 node $Z$ from $X$ cost $3$, from $Y$ cost $1$; $Z\\to G=2$. Cheapest $S\\to G$?</p>`,
      steps:[
        {do:`Cost to $Z$ via $X$: $2+3=5$; via $Y$: $5+1=6$.`, why:`Compare both incoming edges to $Z$.`},
        {do:`Best to $Z=\\min(5,6)=5$.`, why:`Keep the cheaper way to reach $Z$.`},
        {do:`$S\\to G=5+2=7$.`, why:`Add the final edge $Z\\to G$.`}
      ],
      answer:`$7$ (via $S,X,Z,G$)` },

    { q:`<p>Why does UCS expand $G$ only when popped, not when first discovered? Frontier reaches $G$ at cost $9$ while $D$ sits at cost $4$ with edge $D\\!-\\!G=2$. What can still happen to $G$?</p>`,
      steps:[
        {do:`$G$ is on the frontier at $9$ but not settled.`, why:`UCS only finalizes a node when it is the cheapest popped.`},
        {do:`Popping $D(4)$ relaxes $G$ to $4+2=6<9$.`, why:`A cheaper path through $D$ lowers $G$.`},
        {do:`So $G$ is settled at $6$, not $9$.`, why:`Early discovery does not fix the final cost; popping does.`}
      ],
      answer:`$G$ can drop from $9$ to $6$ before settling` },

    { q:`<p>Counting relaxations. In a graph with $V=5$ nodes and $E=8$ edges, Dijkstra relaxes each edge at most once when popping its source. Give an upper bound on total relaxations.</p>`,
      steps:[
        {do:`Each edge is relaxed when its source is settled.`, why:`A node is settled once, so its out-edges relax once.`},
        {do:`Upper bound $=E=8$ relaxations.`, why:`Total relaxations are bounded by the edge count.`},
        {do:`Plus $V=5$ pops from the priority queue.`, why:`Dijkstra's cost is roughly $\\mathcal{O}((V+E)\\log V)$.`}
      ],
      answer:`$\\le8$ relaxations, $5$ pops` },

    { q:`<p>Memoization saves recomputation. A recursive FutureCost over a DAG where node $C$ is reachable from $4$ parents. Without memoization $C$ is solved $4$ times; with it, once. If solving $C$'s subtree costs $K$, how much work is saved?</p>`,
      steps:[
        {do:`Without memo: $4\\times K$ work on $C$'s subtree.`, why:`Each parent re-solves $C$ from scratch.`},
        {do:`With memo: $K$ work (solve once, reuse).`, why:`Memoization stores the first answer.`},
        {do:`Saved $=4K-K=3K$.`, why:`Reuse eliminates the redundant solves.`}
      ],
      answer:`saves $3K$` },

    { q:`<p>Consistency of UCS result. After UCS settles all nodes, is the cost to a settled node ever lowered later? Justify with the non-negative-cost property.</p>`,
      steps:[
        {do:`When a node is popped, its cost is the minimum among the frontier.`, why:`UCS always pops the cheapest unsettled node.`},
        {do:`Any later path goes through more non-negative edges, so cannot be cheaper.`, why:`Adding $\\ge0$ costs cannot reduce a total.`},
        {do:`So a settled node's cost is final.`, why:`This is exactly why UCS needs non-negative costs.`}
      ],
      answer:`no; settled cost is final under non-negative costs` },

    { q:`<p>UCS with zero-cost edges. Edge $A\\!-\\!B=0$ exists. Does UCS still terminate and stay correct? Explain.</p>`,
      steps:[
        {do:`Zero is non-negative, so the "settled is final" property holds.`, why:`UCS needs costs $\\ge0$, and $0$ qualifies.`},
        {do:`Each node is still settled at most once.`, why:`The priority queue pops finitely many nodes.`},
        {do:`So UCS terminates and returns correct shortest costs.`, why:`Zero-cost edges are allowed; negative ones are not.`}
      ],
      answer:`yes; zero-cost edges are fine` },

    { q:`<p>Compare DP and UCS applicability. A graph has a cycle $A\\to B\\to A$ with positive costs. Which method applies directly, and why does the other fail?</p>`,
      steps:[
        {do:`UCS handles cycles via its settled set and priority queue.`, why:`UCS works on any graph with non-negative costs.`},
        {do:`DP needs an acyclic order, which the cycle destroys.`, why:`FutureCost would depend on itself circularly.`},
        {do:`So use UCS here, not plain DP.`, why:`Cycles break DP's well-defined ordering.`}
      ],
      answer:`UCS applies; DP fails on the cycle` }
  ]);

  /* ===================== A* (harder, set 2) ===================== */
  add("ai-astar", [
    { q:`<p>Grid A* with Manhattan heuristic. Start $(0,0)$, goal $(4,3)$. For cell $(2,1)$ reached with $g=5$, compute $h$ and $f$.</p>`,
      steps:[
        {do:`$h=|4-2|+|3-1|=2+2=4$.`, why:`Manhattan distance sums row and column gaps to the goal.`},
        {do:`$f=g+h=5+4=9$.`, why:`A* orders by past cost plus heuristic.`}
      ],
      answer:`$h=4,\\ f=9$` },

    { q:`<p>Euclidean heuristic admissibility on a $4$-connected grid. From a cell, true (Manhattan) cost to goal is $7$; straight-line distance is $\\sqrt{(3)^2+(4)^2}=5$. Is $h=5$ admissible? Is it as informative as Manhattan $h=7$?</p>`,
      steps:[
        {do:`$5\\le7$: yes, admissible (never overestimates true cost).`, why:`Straight-line never exceeds path cost.`},
        {do:`Manhattan $h=7$ equals the true cost here, larger than $5$.`, why:`On a grid Manhattan is the tighter admissible bound.`},
        {do:`Manhattan dominates Euclidean, so it expands fewer nodes.`, why:`A larger admissible heuristic is more informative.`}
      ],
      answer:`$h=5$ admissible but weaker than Manhattan $7$` },

    { q:`<p>Consistency check on a path of three nodes. $h(A)=6,h(B)=4,h(C)=1$, edges $A\\to B=2$, $B\\to C=2$. Verify consistency on both edges.</p>`,
      steps:[
        {do:`Edge $A\\to B$: $h(A)\\le c+h(B)\\Rightarrow6\\le2+4=6$. OK.`, why:`Consistency requires $h$ not to drop faster than real cost.`},
        {do:`Edge $B\\to C$: $4\\le2+1=3$? No, $4\\not\\le3$.`, why:`The heuristic falls by $3$ over a cost-$2$ edge.`},
        {do:`So the heuristic is NOT consistent (fails on $B\\to C$).`, why:`A single violated edge breaks consistency.`}
      ],
      answer:`fails on $B\\to C$: not consistent` },

    { q:`<p>Consistency implies admissibility but not vice versa. Give the reduced cost $\\text{Cost}'=c+h(\\text{Succ})-h(s)$ for edge $A\\to B$ with $c=2$, $h(A)=6$, $h(B)=4$, and confirm the sign.</p>`,
      steps:[
        {do:`$\\text{Cost}'=2+4-6=0$.`, why:`Plug into the reduced-cost formula A* runs UCS on.`},
        {do:`$0\\ge0$: non-negative, so this edge is consistent.`, why:`Consistency is exactly the condition $\\text{Cost}'\\ge0$ on every edge.`},
        {do:`A consistent heuristic keeps all reduced costs $\\ge0$.`, why:`That preserves Dijkstra's correctness on the reduced graph.`}
      ],
      answer:`$\\text{Cost}'=0\\ge0$ (consistent edge)` },

    { q:`<p>Dominance and node count. Heuristics $h_1(s)=2$, $h_2(s)=5$, $h_3(s)=4$, all admissible (true cost $6$). Rank them by how few nodes A* expands.</p>`,
      steps:[
        {do:`All $\\le6$, so all admissible.`, why:`None overestimates the true remaining cost.`},
        {do:`Larger (closer to $6$) dominates: $h_2(5)>h_3(4)>h_1(2)$.`, why:`A bigger admissible heuristic gives tighter $f$ estimates.`},
        {do:`$h_2$ expands fewest, then $h_3$, then $h_1$.`, why:`More informed heuristics prune more of the search.`}
      ],
      answer:`$h_2<h_3<h_1$ in nodes expanded ($h_2$ best)` },

    { q:`<p>The max of two admissible heuristics is admissible. $h_a(s)=3$, $h_b(s)=5$, true cost $6$. Compute $h(s)=\\max(h_a,h_b)$ and confirm admissibility.</p>`,
      steps:[
        {do:`$h=\\max(3,5)=5$.`, why:`Taking the max combines two heuristics into a stronger one.`},
        {do:`$5\\le6$: still admissible.`, why:`If both are below the true cost, so is their max.`},
        {do:`$h=5$ dominates each individual heuristic.`, why:`Maxing admissible heuristics never breaks admissibility and improves informedness.`}
      ],
      answer:`$h=5$, admissible and stronger` },

    { q:`<p>A* expands a node when $f=g+h$ is minimal. Frontier: $P(g=2,h=5)$, $Q(g=4,h=2)$, $R(g=5,h=1)$, $T(g=1,h=6)$. Order the expansions by $f$.</p>`,
      steps:[
        {do:`$f_P=7$, $f_Q=6$, $f_R=6$, $f_T=7$.`, why:`Add $g$ and $h$ for each.`},
        {do:`Order: $Q$ or $R$ (both $6$) first, then $P$ or $T$ (both $7$).`, why:`A* expands lowest $f$ first; ties broken arbitrarily.`},
        {do:`A common rule expands the lower-$h$ (closer-to-goal) tie first, so $R$ then $Q$.`, why:`Tie-breaking toward smaller $h$ pushes toward the goal.`}
      ],
      answer:`$R,Q$ ($f=6$) then $P,T$ ($f=7$)` },

    { q:`<p>An inadmissible heuristic can break optimality. True cheapest cost to goal is $10$ along path X; A* uses $h$ that overestimates a cheaper-looking path Y. If $h$ makes Y's $f=8<$ X's $f=11$, what goes wrong?</p>`,
      steps:[
        {do:`A* prefers Y because $f_Y=8<f_X=11$.`, why:`A* always expands the lower $f$ first.`},
        {do:`But Y is actually costlier; the overestimate on X hid the true best path.`, why:`Inadmissible $h$ can inflate $f$ on the optimal path.`},
        {do:`A* may return a suboptimal path.`, why:`Admissibility ($h\\le$ true) is required for the optimality guarantee.`}
      ],
      answer:`A* returns suboptimal Y; needs admissible $h$` },

    { q:`<p>Weighted A* uses $f=g+w\\cdot h$ with $w>1$ for speed. With $g=4$, $h=3$, compare $f$ at $w=1$ and $w=2$, and state the trade-off.</p>`,
      steps:[
        {do:`$w=1$: $f=4+3=7$.`, why:`Standard A*.`},
        {do:`$w=2$: $f=4+2\\times3=10$.`, why:`Weighting the heuristic greedily favors getting close to the goal.`},
        {do:`Higher $w$ is faster but may overestimate, losing optimality.`, why:`Weighted A* trades solution quality for speed.`}
      ],
      answer:`$f=7$ vs $10$; faster but possibly suboptimal` },

    { q:`<p>Goal heuristic must be zero for admissibility. If $h(\\text{goal})=2>0$ but the true remaining cost at the goal is $0$, why does this break A*?</p>`,
      steps:[
        {do:`At the goal, true cost-to-go is $0$.`, why:`No moves remain once at the goal.`},
        {do:`$h(\\text{goal})=2>0$ overestimates $0$.`, why:`Any positive value at the goal is an overestimate.`},
        {do:`So $h$ is inadmissible and A* may stop with a worse path.`, why:`Admissibility demands $h(\\text{goal})=0$.`}
      ],
      answer:`$h(\\text{goal})$ must be $0$; $2>0$ breaks admissibility` },

    { q:`<p>Relaxed-problem heuristics. The $8$-puzzle "number of misplaced tiles" and "sum of Manhattan distances" are both admissible. For a state with $5$ misplaced tiles whose Manhattan distances sum to $12$, which heuristic dominates?</p>`,
      steps:[
        {do:`Misplaced-tiles $h=5$; Manhattan-sum $h=12$.`, why:`Each relaxation gives a different admissible bound.`},
        {do:`$12\\ge5$, so Manhattan-sum dominates.`, why:`Manhattan counts each tile's distance, never less than just counting misplaced tiles.`},
        {do:`A* with Manhattan-sum expands fewer nodes.`, why:`The more informed admissible heuristic prunes more.`}
      ],
      answer:`Manhattan-sum ($12\\ge5$) dominates` },

    { q:`<p>A* reduces to UCS, then to greedy best-first, depending on $h$. State what A* becomes when (a) $h=0$ and (b) $g$ is ignored ($f=h$).</p>`,
      steps:[
        {do:`(a) $h=0$: $f=g$, so A* ranks by past cost only.`, why:`That is exactly uniform cost search.`},
        {do:`(b) $f=h$: A* ranks by heuristic only, ignoring cost paid.`, why:`That is greedy best-first search.`},
        {do:`A* blends both via $f=g+h$.`, why:`It balances cost-so-far against estimated cost-to-go.`}
      ],
      answer:`(a) UCS; (b) greedy best-first` },

    { q:`<p>Tie-breaking affects efficiency. Two nodes both have $f=10$; one has $h=2$ (near goal), the other $h=8$ (far). Which should A* prefer to expand, and why does it explore fewer nodes?</p>`,
      steps:[
        {do:`Prefer the node with smaller $h=2$ (larger $g$).`, why:`A smaller heuristic means it is closer to the goal.`},
        {do:`Expanding near-goal nodes first reaches the goal sooner.`, why:`It avoids spreading out over far-away regions.`},
        {do:`So fewer total nodes get expanded.`, why:`Good tie-breaking biases the search toward the goal.`}
      ],
      answer:`prefer $h=2$ (near goal); fewer expansions` }
  ]);

  /* ===================== MDP (harder, set 2) ===================== */
  add("ai-mdp", [
    { q:`<p>Four outcomes: $T=0.4$ (r=5), $T=0.3$ (r=2), $T=0.2$ (r=10), $T=0.1$ (r=0). Verify validity and compute the expected immediate reward.</p>`,
      steps:[
        {do:`Sum probs: $0.4+0.3+0.2+0.1=1.0$. Valid.`, why:`Transition probabilities must total $1$.`},
        {do:`Expected $=0.4\\times5+0.3\\times2+0.2\\times10+0.1\\times0$.`, why:`Weight each reward by its probability.`},
        {do:`$=2+0.6+2+0=4.6$.`, why:`Sum the weighted rewards.`}
      ],
      answer:`valid; expected reward $4.6$` },

    { q:`<p>Discounted return of a finite stream $r_1=4,r_2=4,r_3=4,r_4=4,r_5=4$ with $\\gamma=0.5$. Compute $u$.</p>`,
      steps:[
        {do:`Discounts $1,0.5,0.25,0.125,0.0625$ times $4$: $4,2,1,0.5,0.25$.`, why:`Apply $\\gamma^{i-1}$ to each reward.`},
        {do:`$u=4+2+1+0.5+0.25=7.75$.`, why:`Sum the discounted rewards.`},
        {do:`This approaches $4/(1-0.5)=8$ as terms continue.`, why:`A finite stream undershoots the infinite geometric total.`}
      ],
      answer:`$u=7.75$` },

    { q:`<p>Infinite constant reward $r=2$ forever; compare $\\gamma=0.5$ vs $\\gamma=0.9$ using $r/(1-\\gamma)$.</p>`,
      steps:[
        {do:`$\\gamma=0.5$: $u=2/(1-0.5)=2/0.5=4$.`, why:`Geometric-series return for a constant reward.`},
        {do:`$\\gamma=0.9$: $u=2/(1-0.9)=2/0.1=20$.`, why:`Same formula with a more patient discount.`},
        {do:`Higher $\\gamma$ multiplies the total fivefold here.`, why:`Patience accumulates far-future rewards.`}
      ],
      answer:`$4$ vs $20$` },

    { q:`<p>Expected discounted two-step return. Reward $6$ now; then $0.3$ to a state $V=10$, $0.7$ to a state $V=0$, $\\gamma=0.9$. Compute the total.</p>`,
      steps:[
        {do:`Immediate $=6$.`, why:`Step-1 reward is undiscounted.`},
        {do:`Expected next value $=0.3\\times10+0.7\\times0=3$.`, why:`Average over the random next states.`},
        {do:`Total $=6+0.9\\times3=6+2.7=8.7$.`, why:`Add the discounted expected continuation.`}
      ],
      answer:`$8.7$` },

    { q:`<p>Solve for unknown probabilities. $T(s,a,s_1)=2p$, $T(s,a,s_2)=3p$, $T(s,a,s_3)=0.5$. Find $p$ and the three probabilities.</p>`,
      steps:[
        {do:`Require $2p+3p+0.5=1\\Rightarrow5p=0.5$.`, why:`Probabilities sum to $1$.`},
        {do:`$p=0.1$.`, why:`Solve the linear equation.`},
        {do:`Probabilities: $0.2,\\ 0.3,\\ 0.5$.`, why:`Substitute $p=0.1$.`}
      ],
      answer:`$p=0.1$; $(0.2,0.3,0.5)$` },

    { q:`<p>Expected immediate reward with a mix of gains and penalties. Action gives $0.5$ (r=8) and $0.5$ (r=-2). Compute the expected reward.</p>`,
      steps:[
        {do:`$0.5\\times8+0.5\\times(-2)=4-1=3$.`, why:`Average the immediate rewards by probability.`},
        {do:`So the expected immediate reward is $3$.`, why:`Negative outcomes lower but do not necessarily flip the expectation.`}
      ],
      answer:`$3$` },

    { q:`<p>Comparing actions by expected reward. Action L: $0.6$ (r=5), $0.4$ (r=0). Action R: $1.0$ (r=2.5). Which has higher expected immediate reward?</p>`,
      steps:[
        {do:`$E[L]=0.6\\times5+0.4\\times0=3$.`, why:`Weight L's rewards by probability.`},
        {do:`$E[R]=1.0\\times2.5=2.5$.`, why:`R is deterministic.`},
        {do:`$3>2.5$, so L has the higher expected immediate reward.`, why:`Pick the larger expectation.`}
      ],
      answer:`L ($3>2.5$)` },

    { q:`<p>Why is a discount $\\gamma<1$ needed for an infinite-horizon MDP with constant positive rewards? Show what happens to the undiscounted sum.</p>`,
      steps:[
        {do:`Undiscounted: $r+r+r+\\dots=\\infty$ for $r>0$.`, why:`Adding a positive reward forever diverges.`},
        {do:`With $\\gamma<1$: $r/(1-\\gamma)$ is finite.`, why:`The geometric series converges.`},
        {do:`So $\\gamma<1$ keeps values finite and comparable.`, why:`Discounting bounds infinite-horizon returns.`}
      ],
      answer:`undiscounted diverges; $\\gamma<1$ gives finite $r/(1-\\gamma)$` },

    { q:`<p>Slippery-grid transition. "Move right": $0.8$ right (r=$-1$), $0.1$ up (r=$-1$), $0.1$ down (r=$-1$). Compute expected immediate reward and confirm the distribution is valid.</p>`,
      steps:[
        {do:`Probs sum: $0.8+0.1+0.1=1.0$. Valid.`, why:`Transition probabilities must total $1$.`},
        {do:`Expected reward $=0.8(-1)+0.1(-1)+0.1(-1)=-1$.`, why:`Every outcome pays $-1$, so the expectation is $-1$.`},
        {do:`Slipping does not change the per-step reward here.`, why:`The reward is the same regardless of which cell you land in.`}
      ],
      answer:`valid; expected reward $-1$` },

    { q:`<p>Horizon truncation error. Infinite constant reward $r=1$, $\\gamma=0.9$ has true value $10$. A $5$-step truncation gives $1+0.9+0.81+0.729+0.6561=4.0951$. How much value is lost by truncating?</p>`,
      steps:[
        {do:`Truncated $5$-step sum $\\approx4.095$.`, why:`Sum the first five discounted rewards.`},
        {do:`True infinite value $=1/(1-0.9)=10$.`, why:`Geometric-series total.`},
        {do:`Lost $\\approx10-4.095=5.905$.`, why:`The discounted tail beyond step $5$ still carries value.`}
      ],
      answer:`$\\approx5.905$ lost` },

    { q:`<p>Conditional transition. From $s$, action $a$ goes to $s_1$ then must take $a'$. Combined probability of path $s\\to s_1\\to s_2$ is $T(s,a,s_1)\\,T(s_1,a',s_2)$. With $T(s,a,s_1)=0.5$ and $T(s_1,a',s_2)=0.4$, find it.</p>`,
      steps:[
        {do:`Multiply the two transition probabilities: $0.5\\times0.4$.`, why:`The Markov property makes consecutive steps multiply.`},
        {do:`$=0.2$.`, why:`The chance of the whole two-step path.`}
      ],
      answer:`$0.2$` },

    { q:`<p>Expected reward with a terminal absorbing state. Action: $0.7$ to a state (r=3 then continues), $0.3$ to a terminal (r=10 then $0$ forever). Expected immediate reward only.</p>`,
      steps:[
        {do:`$0.7\\times3+0.3\\times10$.`, why:`Average the immediate rewards by probability.`},
        {do:`$=2.1+3=5.1$.`, why:`Sum the weighted rewards.`}
      ],
      answer:`$5.1$` }
  ]);

  /* ===================== POLICY & VALUE (harder, set 2) ===================== */
  add("ai-policy-value", [
    { q:`<p>Deterministic policy gives rewards $r_1=6,r_2=8,r_3=2,r_4=10$ with $\\gamma=0.5$. Compute $V_\\pi$ at the start.</p>`,
      steps:[
        {do:`Discounts $1,0.5,0.25,0.125$ times rewards: $6,4,0.5,1.25$.`, why:`Apply $\\gamma^{i-1}$ to each reward.`},
        {do:`$V_\\pi=6+4+0.5+1.25=11.75$.`, why:`With no randomness, value equals the discounted utility.`}
      ],
      answer:`$V_\\pi=11.75$` },

    { q:`<p>Three-state policy chain. $A$: r=2 to $B$; $B$: r=4 to $C$; $C$: r=6 terminal. $\\gamma=0.5$. Compute $V_\\pi(C),V_\\pi(B),V_\\pi(A)$.</p>`,
      steps:[
        {do:`$V_\\pi(C)=6$ (terminal, no continuation).`, why:`Terminal value is just its reward.`},
        {do:`$V_\\pi(B)=4+0.5\\times6=4+3=7$.`, why:`Reward plus discounted value of $C$.`},
        {do:`$V_\\pi(A)=2+0.5\\times7=2+3.5=5.5$.`, why:`Reward plus discounted value of $B$.`}
      ],
      answer:`$C=6,B=7,A=5.5$` },

    { q:`<p>Self-loop policy value. $V_\\pi(s)=r+\\gamma V_\\pi(s)$ with $r=5$, $\\gamma=0.8$. Solve for $V_\\pi(s)$.</p>`,
      steps:[
        {do:`$V=5+0.8V\\Rightarrow0.2V=5$.`, why:`Collect the $V$ terms; the loop makes $s'=s$.`},
        {do:`$V=25$.`, why:`Divide by $0.2$.`}
      ],
      answer:`$V_\\pi(s)=25$` },

    { q:`<p>Two-state mutual loop. $A$: r=1 to $B$; $B$: r=1 to $A$; $\\gamma=0.5$. By symmetry $V_\\pi(A)=V_\\pi(B)=V$. Solve $V=1+0.5V$.</p>`,
      steps:[
        {do:`Symmetry gives $V_\\pi(A)=V_\\pi(B)=V$.`, why:`Each state has the same reward and leads to the other.`},
        {do:`$V=1+0.5V\\Rightarrow0.5V=1$.`, why:`Substitute the equal values.`},
        {do:`$V=2$.`, why:`Divide by $0.5$.`}
      ],
      answer:`$V_\\pi=2$ for both` },

    { q:`<p>Stochastic policy. At $s$ the policy picks action L with prob $0.6$ (run utility $10$) and R with prob $0.4$ (utility $5$). Compute $V_\\pi(s)$.</p>`,
      steps:[
        {do:`$V_\\pi(s)=0.6\\times10+0.4\\times5$.`, why:`Value averages over the policy's random action choice.`},
        {do:`$=6+2=8$.`, why:`Sum the weighted utilities.`}
      ],
      answer:`$V_\\pi(s)=8$` },

    { q:`<p>Compare two policies under different discounts. Policy A: rewards $9,0,0$. Policy B: $3,3,3$. Which is better at $\\gamma=0.9$ (vs $\\gamma=0.5$ where A won)?</p>`,
      steps:[
        {do:`A at $\\gamma=0.9$: $9+0+0=9$.`, why:`Only the first reward survives.`},
        {do:`B at $\\gamma=0.9$: $3+2.7+2.43=8.13$.`, why:`Discount each of B's rewards by $\\gamma^{i-1}$.`},
        {do:`$9>8.13$, so A still wins, but the gap narrowed.`, why:`Higher $\\gamma$ values B's later rewards more, closing the gap.`}
      ],
      answer:`A ($9>8.13$); gap narrows with higher $\\gamma$` },

    { q:`<p>Infinite policy value with a one-time bonus. Stream is $20$ once, then $2$ forever, $\\gamma=0.5$. Compute $V_\\pi$ using $20+\\gamma\\cdot\\frac{2}{1-\\gamma}$.</p>`,
      steps:[
        {do:`Tail from step 2: $\\frac{2}{1-0.5}=4$.`, why:`Constant-$2$ infinite return.`},
        {do:`$V_\\pi=20+0.5\\times4=20+2=22$.`, why:`The bonus pays now; the tail is discounted by one step.`}
      ],
      answer:`$V_\\pi=22$` },

    { q:`<p>Bellman expectation equation. $V_\\pi(s)=\\sum_{s'}T(s,\\pi(s),s')[r+\\gamma V_\\pi(s')]$. With two next states $0.5(r=4,V=2)$ and $0.5(r=0,V=6)$, $\\gamma=0.5$, compute $V_\\pi(s)$.</p>`,
      steps:[
        {do:`Brackets: $4+0.5\\times2=5$ and $0+0.5\\times6=3$.`, why:`Reward plus discounted next value per outcome.`},
        {do:`$V_\\pi(s)=0.5\\times5+0.5\\times3=2.5+1.5=4$.`, why:`Average over the transition probabilities.`}
      ],
      answer:`$V_\\pi(s)=4$` },

    { q:`<p>Policy improvement check. At $s$, current policy takes L with value $Q(s,L)=5$, but $Q(s,R)=7$. Should the policy switch, and what is the new $V_\\pi(s)$ after a greedy improvement?</p>`,
      steps:[
        {do:`Compare $Q(s,R)=7>Q(s,L)=5$.`, why:`A higher Q-value means a better action.`},
        {do:`Switch the policy at $s$ to R.`, why:`Policy improvement picks the greedy action.`},
        {do:`New $V_\\pi(s)=7$.`, why:`The state's value becomes the Q-value of the new action.`}
      ],
      answer:`switch to R; $V_\\pi(s)=7$` },

    { q:`<p>Value of a fixed policy in a $2$-step horizon (no infinite tail). $A$: r=3 to $B$; $B$: r=5, then horizon ends. $\\gamma=0.9$. Compute $V_\\pi(A)$.</p>`,
      steps:[
        {do:`Step 1 reward $=3$ (undiscounted).`, why:`The first reward at $A$ is full value.`},
        {do:`Step 2 reward $=0.9\\times5=4.5$.`, why:`The reward at $B$ is one step later.`},
        {do:`$V_\\pi(A)=3+4.5=7.5$.`, why:`Sum the discounted rewards over the horizon.`}
      ],
      answer:`$V_\\pi(A)=7.5$` },

    { q:`<p>Negative rewards (costs). A path pays $r_1=-2,r_2=-2,r_3=-2$ with $\\gamma=0.5$. Compute $V_\\pi$ and interpret the sign.</p>`,
      steps:[
        {do:`Discounted: $-2,\\ -1,\\ -0.5$.`, why:`Apply $\\gamma^{i-1}$ to each cost.`},
        {do:`$V_\\pi=-2-1-0.5=-3.5$.`, why:`Sum the discounted costs.`},
        {do:`Negative value means the policy accumulates net cost.`, why:`Rewards can be negative to model penalties.`}
      ],
      answer:`$V_\\pi=-3.5$` },

    { q:`<p>Geometric tail fraction. Infinite constant reward $r=5$, $\\gamma=0.8$. What fraction of the total value $V_\\pi$ comes from steps $3$ onward?</p>`,
      steps:[
        {do:`Total $V_\\pi=5/(1-0.8)=25$.`, why:`Geometric series of constant reward.`},
        {do:`Steps $1,2$ contribute $5+5\\times0.8=5+4=9$.`, why:`The first two (undiscounted/once-discounted) rewards.`},
        {do:`Steps $3+$ give $25-9=16$, a fraction $16/25=0.64$.`, why:`Most value lies in the discounted tail.`}
      ],
      answer:`$16/25=0.64$ from steps $3+$` }
  ]);

  /* ===================== Q-VALUE (harder, set 2) ===================== */
  add("ai-qvalue", [
    { q:`<p>Four outcomes, $\\gamma=0.5$: $0.4(r=6,V=4)$, $0.3(r=2,V=10)$, $0.2(r=0,V=0)$, $0.1(r=-4,V=2)$. Compute $Q(s,a)$.</p>`,
      steps:[
        {do:`Brackets: $6+2=8$, $2+5=7$, $0+0=0$, $-4+1=-3$.`, why:`Each bracket is reward plus $\\gamma V$.`},
        {do:`Weighted: $0.4\\times8+0.3\\times7+0.2\\times0+0.1\\times(-3)=3.2+2.1+0-0.3$.`, why:`Multiply each bracket by its probability.`},
        {do:`$Q=3.2+2.1-0.3=5.0$.`, why:`Sum the weighted outcome values.`}
      ],
      answer:`$Q=5.0$` },

    { q:`<p>Greedy choice among three actions, $\\gamma=0.9$. $Q$ inputs: L $=1.0(r=2,V=5)$; M $=0.5(r=10,V=0)+0.5(r=0,V=0)$; R $=1.0(r=0,V=8)$. Compute each $Q$ and pick the best.</p>`,
      steps:[
        {do:`$Q_L=2+0.9\\times5=2+4.5=6.5$.`, why:`Deterministic action with a moderate future.`},
        {do:`$Q_M=0.5\\times10+0.5\\times0=5$; $Q_R=0+0.9\\times8=7.2$.`, why:`Average M's outcomes; R has a strong future value.`},
        {do:`$\\max(6.5,5,7.2)=7.2$, choose R.`, why:`Greedy picks the highest Q-value.`}
      ],
      answer:`$Q_L=6.5,Q_M=5,Q_R=7.2$; choose R` },

    { q:`<p>Q-learning-style backup uses $\\max_{a'}Q(s',a')$ for the next state. With reward $3$, $\\gamma=0.5$, and next-state Q-values $\\{Q(s',a_1)=8,Q(s',a_2)=2\\}$, compute the target $r+\\gamma\\max_{a'}Q(s',a')$.</p>`,
      steps:[
        {do:`$\\max_{a'}Q(s',a')=\\max(8,2)=8$.`, why:`The bootstrap uses the best next action.`},
        {do:`Target $=3+0.5\\times8=3+4=7$.`, why:`Reward plus discounted best future Q.`}
      ],
      answer:`target $=7$` },

    { q:`<p>Same successor both ways. Action: $0.5(r=10)$, $0.5(r=-2)$, both land in $s'$ with $V(s')=6$, $\\gamma=0.9$. Compute $Q$ by separating reward and future.</p>`,
      steps:[
        {do:`Expected reward $=0.5\\times10+0.5\\times(-2)=5-1=4$.`, why:`Average the immediate rewards.`},
        {do:`Future $=\\gamma V(s')=0.9\\times6=5.4$ (same $s'$).`, why:`The discounted future is identical across outcomes.`},
        {do:`$Q=4+5.4=9.4$.`, why:`Add expected reward and discounted future.`}
      ],
      answer:`$Q=9.4$` },

    { q:`<p>Self-loop Q-value with consistency. Action self-loops to $s$ (prob $1$, reward $3$), and $V(s)$ equals this $Q$ under the policy. Solve $Q=3+\\gamma Q$ with $\\gamma=0.5$.</p>`,
      steps:[
        {do:`$Q=3+0.5Q\\Rightarrow0.5Q=3$.`, why:`The successor is $s$, and $V(s)=Q$ here.`},
        {do:`$Q=6$.`, why:`Divide both sides by $0.5$.`}
      ],
      answer:`$Q=6$` },

    { q:`<p>Three outcomes to distinct successors, $\\gamma=1$ (no discount): $0.2(r=0,V=10)$, $0.5(r=4,V=2)$, $0.3(r=-2,V=0)$. Compute $Q$.</p>`,
      steps:[
        {do:`Brackets with $\\gamma=1$: $0+10=10$, $4+2=6$, $-2+0=-2$.`, why:`Future value undiscounted.`},
        {do:`Weighted: $0.2\\times10+0.5\\times6+0.3\\times(-2)=2+3-0.6$.`, why:`Multiply each by its probability.`},
        {do:`$Q=2+3-0.6=4.4$.`, why:`Sum the weighted outcomes.`}
      ],
      answer:`$Q=4.4$` },

    { q:`<p>Advantage $A(s,a)=Q(s,a)-V(s)$. With $Q(s,\\text{up})=9$, $Q(s,\\text{down})=4$, and $V(s)=\\max=9$, compute the advantage of each action.</p>`,
      steps:[
        {do:`$V(s)=\\max(9,4)=9$.`, why:`Under the greedy policy, $V$ is the best Q-value.`},
        {do:`$A(\\text{up})=9-9=0$; $A(\\text{down})=4-9=-5$.`, why:`Advantage measures how much better an action is than the best.`},
        {do:`The greedy action has zero advantage; others are negative.`, why:`Advantage is $\\le0$ when $V$ is the max Q.`}
      ],
      answer:`$A(\\text{up})=0,\\ A(\\text{down})=-5$` },

    { q:`<p>Expected SARSA backup uses $\\sum_{a'}\\pi(a'|s')Q(s',a')$ instead of the max. With reward $2$, $\\gamma=0.5$, $\\pi(a_1)=0.7,\\pi(a_2)=0.3$, $Q(s',a_1)=10,Q(s',a_2)=0$, compute the target.</p>`,
      steps:[
        {do:`Expected next Q $=0.7\\times10+0.3\\times0=7$.`, why:`Average next-state Q under the policy's action probabilities.`},
        {do:`Target $=2+0.5\\times7=2+3.5=5.5$.`, why:`Reward plus discounted expected next Q.`}
      ],
      answer:`target $=5.5$` },

    { q:`<p>Compare $\\max$ vs expectation in backups. From the previous data ($Q=10,0$, policy $0.7/0.3$), compute the max-based target ($r+\\gamma\\max$) and explain why it is at least the expected-SARSA target.</p>`,
      steps:[
        {do:`Max target $=2+0.5\\times\\max(10,0)=2+5=7$.`, why:`Q-learning bootstraps off the best next action.`},
        {do:`Expected-SARSA target was $5.5$.`, why:`Averaging includes the weaker action $a_2$.`},
        {do:`$7\\ge5.5$: the max is never below the expectation.`, why:`The maximum dominates any weighted average of the same values.`}
      ],
      answer:`max $7\\ge$ expected $5.5$` },

    { q:`<p>Two-step Q lookahead. Action $a$ deterministically gives reward $2$ to $s'$, where the best action gives $Q(s',\\cdot)=\\{a_1:6,a_2:1\\}$, $\\gamma=0.9$. Compute $Q(s,a)$ assuming greedy continuation.</p>`,
      steps:[
        {do:`Greedy next value $=\\max(6,1)=6$.`, why:`Continue with the best action at $s'$.`},
        {do:`$Q(s,a)=2+0.9\\times6=2+5.4=7.4$.`, why:`Reward plus discounted best continuation.`}
      ],
      answer:`$Q=7.4$` },

    { q:`<p>Stochastic action with future values differing per outcome. $0.6(r=1,V=10)$, $0.4(r=5,V=0)$, $\\gamma=0.5$. Compute $Q$, then say which outcome contributes more.</p>`,
      steps:[
        {do:`Term 1: $0.6\\times[1+0.5\\times10]=0.6\\times6=3.6$.`, why:`High future value drives the first outcome.`},
        {do:`Term 2: $0.4\\times[5+0]=0.4\\times5=2$.`, why:`Higher reward but no future value.`},
        {do:`$Q=3.6+2=5.6$; outcome 1 contributes more ($3.6>2$).`, why:`Future value outweighs the immediate reward here.`}
      ],
      answer:`$Q=5.6$; outcome 1 contributes more` },

    { q:`<p>Optimal Q satisfies $Q^*(s,a)=\\sum_{s'}T[r+\\gamma\\max_{a'}Q^*(s',a')]$. For a deterministic action to a terminal $s'$ ($\\max_{a'}Q^*(s',\\cdot)=0$), reward $7$, $\\gamma=0.9$, find $Q^*$.</p>`,
      steps:[
        {do:`Terminal: $\\max_{a'}Q^*(s',a')=0$.`, why:`No future value at a terminal state.`},
        {do:`$Q^*=7+0.9\\times0=7$.`, why:`The Bellman optimality backup reduces to the reward.`}
      ],
      answer:`$Q^*=7$` }
  ]);

  /* ===================== VALUE ITERATION (harder, set 2) ===================== */
  add("ai-value-iteration", [
    { q:`<p>Chain $A\\to B\\to C\\to D$ (terminal $V=0$). Each edge reward $2$, $\\gamma=0.5$, start $V^{(0)}=0$. Compute $V^{(1)}$ for all of $A,B,C$, then $V^{(2)}(A)$.</p>`,
      steps:[
        {do:`Sweep 1 (all use $V^{(0)}=0$): $V^{(1)}(C)=2$, $V^{(1)}(B)=2$, $V^{(1)}(A)=2$.`, why:`Each backs up reward $2$ plus discounted zero.`},
        {do:`Sweep 2: $V^{(2)}(A)=2+0.5\\times V^{(1)}(B)=2+0.5\\times2=3$.`, why:`Now $B$'s value $2$ flows into $A$.`}
      ],
      answer:`$V^{(1)}=2$ each; $V^{(2)}(A)=3$` },

    { q:`<p>Converge the chain above. At the fixed point, $V^*(C)=2$, $V^*(B)=2+0.5\\,V^*(C)$, $V^*(A)=2+0.5\\,V^*(B)$. Solve all three.</p>`,
      steps:[
        {do:`$V^*(C)=2$ (next is terminal).`, why:`$C$ leads to $D$ with $V=0$.`},
        {do:`$V^*(B)=2+0.5\\times2=3$.`, why:`Substitute $V^*(C)=2$.`},
        {do:`$V^*(A)=2+0.5\\times3=3.5$.`, why:`Substitute $V^*(B)=3$.`}
      ],
      answer:`$V^*: C=2,B=3,A=3.5$` },

    { q:`<p>Self-loop with reward $3$, $\\gamma=0.5$. From $V^{(0)}=0$ give $V^{(1)},V^{(2)},V^{(3)},V^{(4)}$ and the fixed point.</p>`,
      steps:[
        {do:`$V^{(1)}=3+0.5\\times0=3$; $V^{(2)}=3+0.5\\times3=4.5$.`, why:`Each sweep folds in the previous estimate.`},
        {do:`$V^{(3)}=3+0.5\\times4.5=5.25$; $V^{(4)}=3+0.5\\times5.25=5.625$.`, why:`Values climb toward the fixed point.`},
        {do:`Fixed point: $V=3+0.5V\\Rightarrow V=6$.`, why:`At convergence the value equals its own backup.`}
      ],
      answer:`$3,4.5,5.25,5.625\\to6$` },

    { q:`<p>Two-action sweep with a stochastic action. From $V^{(0)}=0$, $\\gamma=0.5$. Action L: $1.0(r=2,V^{(0)}=0)$. Action R: $0.5(r=4,V^{(0)}=0)+0.5(r=0,V^{(0)}=0)$. Compute $V^{(1)}(s)$ and $\\pi^*$.</p>`,
      steps:[
        {do:`$Q(L)=2+0.5\\times0=2$.`, why:`Deterministic action backup.`},
        {do:`$Q(R)=0.5\\times4+0.5\\times0=2$.`, why:`Average R's two outcomes.`},
        {do:`$V^{(1)}=\\max(2,2)=2$; either action is optimal (tie).`, why:`Value iteration takes the best Q-value; ties allow either.`}
      ],
      answer:`$V^{(1)}=2$; L or R (tie)` },

    { q:`<p>Stochastic backup with nonzero starting values. Single action: $0.6(r=4\\to X)$, $0.4(r=0\\to Y)$. $V^{(0)}(X)=10$, $V^{(0)}(Y)=5$, $\\gamma=0.5$. Compute $V^{(1)}(s)$.</p>`,
      steps:[
        {do:`Brackets: $4+0.5\\times10=9$ and $0+0.5\\times5=2.5$.`, why:`Reward plus discounted next value per outcome.`},
        {do:`$Q=0.6\\times9+0.4\\times2.5=5.4+1=6.4$.`, why:`Average over outcomes by probability.`},
        {do:`$V^{(1)}(s)=\\max(6.4)=6.4$.`, why:`One action, so the max is its Q-value.`}
      ],
      answer:`$V^{(1)}(s)=6.4$` },

    { q:`<p>Three-sweep propagation. States $A\\to B\\to C$ (terminal $V=0$), each reward $1$, $\\gamma=0.9$, $V^{(0)}=0$. Compute $V^{(3)}(A)$.</p>`,
      steps:[
        {do:`Sweep 1: $V^{(1)}(C)=1,V^{(1)}(B)=1,V^{(1)}(A)=1$.`, why:`All back up reward $1$ plus discounted zero.`},
        {do:`Sweep 2: $V^{(2)}(B)=1+0.9\\times1=1.9$, $V^{(2)}(A)=1+0.9\\times1=1.9$.`, why:`Updated downstream values flow upstream.`},
        {do:`Sweep 3: $V^{(3)}(A)=1+0.9\\times V^{(2)}(B)=1+0.9\\times1.9=2.71$.`, why:`Use sweep-2's $B$ value.`}
      ],
      answer:`$V^{(3)}(A)=2.71$` },

    { q:`<p>Convergence rate. The Bellman backup is a $\\gamma$-contraction, so error shrinks by $\\gamma$ each sweep. If the initial error is $8$ and $\\gamma=0.5$, what is the error after $3$ sweeps?</p>`,
      steps:[
        {do:`Error after $k$ sweeps $\\le\\gamma^k\\times$ initial.`, why:`Each sweep multiplies the max error by at most $\\gamma$.`},
        {do:`$0.5^3\\times8=0.125\\times8=1$.`, why:`Apply the contraction three times.`},
        {do:`So the error is at most $1$.`, why:`Value iteration converges geometrically at rate $\\gamma$.`}
      ],
      answer:`$\\le1$` },

    { q:`<p>Stopping rule with discount. After a sweep, $\\max_s|V^{(t)}-V^{(t-1)}|=0.05$, $\\gamma=0.9$. The value error bound is $\\dfrac{\\gamma}{1-\\gamma}\\times0.05$. Compute it.</p>`,
      steps:[
        {do:`$\\dfrac{\\gamma}{1-\\gamma}=\\dfrac{0.9}{0.1}=9$.`, why:`This factor converts the sweep change into a value-error bound.`},
        {do:`Bound $=9\\times0.05=0.45$.`, why:`The true values are within $0.45$ of the current estimate.`}
      ],
      answer:`error bound $0.45$` },

    { q:`<p>Policy extraction after convergence. Converged $V^*$: from $s$, $Q(s,\\text{up})=4+0.9\\times5=8.5$, $Q(s,\\text{down})=6+0.9\\times2=7.8$. Give $V^*(s)$ and $\\pi^*(s)$.</p>`,
      steps:[
        {do:`$Q$ values are $8.5$ and $7.8$.`, why:`Computed from the converged next-state values.`},
        {do:`$V^*(s)=\\max(8.5,7.8)=8.5$.`, why:`The state value is the best Q.`},
        {do:`$\\pi^*(s)=\\text{up}$.`, why:`Argmax selects the best action.`}
      ],
      answer:`$V^*(s)=8.5$, $\\pi^*=\\text{up}$` },

    { q:`<p>Comparing $\\gamma$ effects on the same chain. $A\\to B$ terminal, reward at $A$ is $1$ to $B$, $B$ terminal reward $10$. Converged $V^*(A)=1+\\gamma\\times10$. Compute for $\\gamma=0.5$ and $\\gamma=0.9$.</p>`,
      steps:[
        {do:`$\\gamma=0.5$: $V^*(A)=1+0.5\\times10=6$.`, why:`The big downstream reward is discounted by one step.`},
        {do:`$\\gamma=0.9$: $V^*(A)=1+0.9\\times10=10$.`, why:`A more patient agent values $B$'s reward more.`},
        {do:`Higher $\\gamma$ raises $A$'s value.`, why:`Future rewards count more as $\\gamma\\to1$.`}
      ],
      answer:`$6$ vs $10$` },

    { q:`<p>Two interacting states, full sweeps. $A$: action r=2 to $B$. $B$: action r=3 to $A$ (loop). $\\gamma=0.5$, $V^{(0)}=0$. Compute $V^{(1)}(A),V^{(1)}(B)$ then $V^{(2)}(A)$.</p>`,
      steps:[
        {do:`Sweep 1: $V^{(1)}(A)=2+0.5\\times0=2$, $V^{(1)}(B)=3+0.5\\times0=3$.`, why:`Both use the zero starting values.`},
        {do:`Sweep 2: $V^{(2)}(A)=2+0.5\\times V^{(1)}(B)=2+0.5\\times3=3.5$.`, why:`Now $B$'s value $3$ flows into $A$.`}
      ],
      answer:`$V^{(1)}(A,B)=(2,3)$; $V^{(2)}(A)=3.5$` },

    { q:`<p>Fixed point of the mutual loop above. $V^*(A)=2+0.5V^*(B)$, $V^*(B)=3+0.5V^*(A)$. Solve the two equations.</p>`,
      steps:[
        {do:`Substitute: $V^*(A)=2+0.5(3+0.5V^*(A))=3.5+0.25V^*(A)$.`, why:`Plug $V^*(B)$ into $V^*(A)$.`},
        {do:`$0.75V^*(A)=3.5\\Rightarrow V^*(A)=14/3\\approx4.67$.`, why:`Collect terms and solve.`},
        {do:`$V^*(B)=3+0.5\\times4.67\\approx5.33$.`, why:`Back-substitute for $B$.`}
      ],
      answer:`$V^*(A)\\approx4.67,\\ V^*(B)\\approx5.33$` }
  ]);

})();
