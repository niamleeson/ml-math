/* =====================================================================
   PRACTICE — MODULE 2 (Machine Learning), set B.
   Owned ids: ml-svm, ml-kernels, ml-gda, ml-naive-bayes, ml-trees,
              ml-ensembles, ml-knn, ml-bias-variance, ml-learning-theory.
   10 problems each, easy -> hard. Beginner tone, every step has do + why.
   ===================================================================== */
(function(){ Object.assign(window.PRACTICE, {

  "ml-svm": [
    { q:`<p>An SVM has $\\lVert w\\rVert = 2$. The margin width is $2/\\lVert w\\rVert$. What is the margin width?</p>`,
      steps:[
        {do:`Plug in: $2/\\lVert w\\rVert = 2/2$.`, why:`Just substitute the given length into the width formula.`},
        {do:`$2/2 = 1$.`, why:`Simple division.`}
      ],
      answer:`Margin width $= 1$.` },

    { q:`<p>An SVM has $\\lVert w\\rVert = 4$. The full margin width is $2/\\lVert w\\rVert$. What is it?</p>`,
      steps:[
        {do:`Width $= 2/\\lVert w\\rVert = 2/4$.`, why:`Use the width formula with the given norm.`},
        {do:`$2/4 = 0.5$.`, why:`Divide.`}
      ],
      answer:`Margin width $= 0.5$.` },

    { q:`<p>A 1D SVM puts class $-1$ at $x=2$ and class $+1$ at $x=6$. Where is the boundary, and what is the margin half-width?</p>`,
      steps:[
        {do:`Boundary is halfway: $(2+6)/2 = 4$.`, why:`The widest gap centers the line between the two points.`},
        {do:`Half-width $= |6-4| = 2$.`, why:`Distance from the boundary to either point.`}
      ],
      answer:`Boundary at $x=4$; half-width $=2$.` },

    { q:`<p>The decision rule is $h(x)=\\text{sign}(w^\\top x - b)$. Here $w=2$, $b=8$, and $x=5$ (all scalars). What class?</p>`,
      steps:[
        {do:`Score $= w^\\top x - b = 2\\times 5 - 8 = 2$.`, why:`Compute the linear score before taking the sign.`},
        {do:`$\\text{sign}(2) = +1$.`, why:`A positive score means the $+1$ class.`}
      ],
      answer:`Class $+1$.` },

    { q:`<p>With $w=(1,1)$, $b=3$, classify the point $x=(1,1)$ using $\\text{sign}(w^\\top x - b)$.</p>`,
      steps:[
        {do:`Dot product: $w^\\top x = 1\\times1 + 1\\times1 = 2$.`, why:`Multiply matching entries and add.`},
        {do:`Score $= 2 - 3 = -1$.`, why:`Subtract the bias $b$.`},
        {do:`$\\text{sign}(-1) = -1$.`, why:`A negative score means the $-1$ class.`}
      ],
      answer:`Class $-1$.` },

    { q:`<p>An SVM scores a point at exactly $w^\\top x - b = 0$. What does this tell you about the point?</p>`,
      steps:[
        {do:`The score is $0$, where $\\text{sign}$ is undefined.`, why:`Sign splits positive from negative; $0$ is the dividing value.`},
        {do:`$w^\\top x - b = 0$ is the boundary equation.`, why:`That is the definition of the separating line itself.`}
      ],
      answer:`The point sits exactly on the decision boundary.` },

    { q:`<p>Two SVMs separate the same data. SVM A has $\\lVert w\\rVert = 1$, SVM B has $\\lVert w\\rVert = 5$. Which has the wider margin?</p>`,
      steps:[
        {do:`Margin $= 2/\\lVert w\\rVert$. A: $2/1 = 2$. B: $2/5 = 0.4$.`, why:`Smaller $\\lVert w\\rVert$ gives a wider margin.`},
        {do:`$2 &gt; 0.4$.`, why:`Compare the two widths.`}
      ],
      answer:`SVM A (margin $2$ vs $0.4$).` },

    { q:`<p>A point $x^{(i)}$ of class $y^{(i)}=+1$ has $w^\\top x^{(i)} - b = 1$. Does it satisfy the SVM constraint $y^{(i)}(w^\\top x^{(i)} - b)\\ge 1$?</p>`,
      steps:[
        {do:`Compute $y^{(i)}(w^\\top x^{(i)} - b) = (+1)\\times 1 = 1$.`, why:`Multiply the label by the score.`},
        {do:`$1 \\ge 1$ is true.`, why:`The constraint holds with equality.`}
      ],
      answer:`Yes; it sits right on the margin edge (a support vector).` },

    { q:`<p>A support vector has $w^\\top x - b = \\pm 1$ at the margin. With $w=(2,0)$ and $b=0$, what value of $x_1$ puts a point on the $+1$ margin (with $x_2=0$)?</p>`,
      steps:[
        {do:`Score $= w^\\top x - b = 2x_1 + 0 - 0 = 2x_1$.`, why:`Only the first weight is nonzero.`},
        {do:`Set $2x_1 = 1$, so $x_1 = 0.5$.`, why:`The $+1$ margin is where the score equals $1$.`}
      ],
      answer:`$x_1 = 0.5$.` },

    { q:`<p>A soft-margin SVM lets a point break the rule with a slack penalty. A point of class $+1$ has score $w^\\top x - b = -0.2$. Is it on the correct side, and by how much is the margin violated (target is $\\ge 1$)?</p>`,
      steps:[
        {do:`Correct side needs a positive score; here score $=-0.2 &lt; 0$.`, why:`Class $+1$ should have a positive score.`},
        {do:`Slack $= 1 - (\\text{label}\\times\\text{score}) = 1 - (1)(-0.2) = 1.2$.`, why:`Slack measures how far below the target $1$ the margin falls.`}
      ],
      answer:`Wrong side; slack $=1.2$.` }
  ],

  "ml-kernels": [
    { q:`<p>Evaluate the linear kernel $K(x,z)=x^\\top z$ for $x=(1,2)$ and $z=(3,4)$.</p>`,
      steps:[
        {do:`Dot product: $1\\times3 + 2\\times4 = 3 + 8$.`, why:`The linear kernel is just the dot product.`},
        {do:`$3 + 8 = 11$.`, why:`Add the terms.`}
      ],
      answer:`$K = 11$.` },

    { q:`<p>Evaluate the polynomial kernel $K(x,z)=(x^\\top z)^2$ for $x=(1,0)$ and $z=(2,0)$.</p>`,
      steps:[
        {do:`Dot product: $x^\\top z = 1\\times2 + 0\\times0 = 2$.`, why:`First find the inner dot product.`},
        {do:`Square it: $2^2 = 4$.`, why:`The kernel squares the dot product.`}
      ],
      answer:`$K = 4$.` },

    { q:`<p>Evaluate the polynomial kernel $K(x,z)=(x^\\top z + 1)^2$ for $x=(1,1)$ and $z=(1,0)$.</p>`,
      steps:[
        {do:`Dot product: $1\\times1 + 1\\times0 = 1$.`, why:`Compute the inner product first.`},
        {do:`Add $1$: $1 + 1 = 2$.`, why:`This kernel adds a constant before squaring.`},
        {do:`Square: $2^2 = 4$.`, why:`Apply the square.`}
      ],
      answer:`$K = 4$.` },

    { q:`<p>Gaussian kernel $K(x,z)=\\exp\\!\\left(-\\frac{\\lVert x-z\\rVert^2}{2\\sigma^2}\\right)$ with $\\sigma=1$. What is $K$ when $x=z$?</p>`,
      steps:[
        {do:`$x=z$ means $\\lVert x-z\\rVert^2 = 0$.`, why:`A point is at zero distance from itself.`},
        {do:`$K = \\exp(0) = 1$.`, why:`The exponent is $0$, and $\\exp(0)=1$, the maximum.`}
      ],
      answer:`$K = 1$.` },

    { q:`<p>Gaussian kernel with $\\sigma=1$. Two points are at distance $2$, so $\\lVert x-z\\rVert^2 = 4$. Compute $K$.</p>`,
      steps:[
        {do:`Exponent: $-\\frac{\\lVert x-z\\rVert^2}{2\\sigma^2} = -\\frac{4}{2\\times1} = -2$.`, why:`Plug the squared distance and $\\sigma$ into the exponent.`},
        {do:`$K = \\exp(-2) \\approx 0.135$.`, why:`Take $e$ to that power.`}
      ],
      answer:`$K = \\exp(-2) \\approx 0.135$.` },

    { q:`<p>Gaussian kernel. As two points move farther apart, does $K(x,z)$ go up or down? What is its smallest possible value?</p>`,
      steps:[
        {do:`Bigger distance makes the exponent more negative.`, why:`The squared distance is in the numerator with a minus sign.`},
        {do:`$\\exp$ of a large negative number tends to $0$.`, why:`$e^{-\\text{big}}$ shrinks toward $0$.`}
      ],
      answer:`$K$ goes down, approaching $0$ (never reaching it).` },

    { q:`<p>A valid kernel equals $\\phi(x)^\\top\\phi(z)$ for some feature map $\\phi$. For $K(x,z)=(xz)^2$ in 1D, the map is $\\phi(x)=x^2$. Check $K=\\phi(x)\\phi(z)$ for $x=2,z=3$.</p>`,
      steps:[
        {do:`Direct kernel: $(xz)^2 = (2\\times3)^2 = 36$.`, why:`Evaluate the kernel formula directly.`},
        {do:`Via map: $\\phi(x)\\phi(z) = x^2 z^2 = 4\\times9 = 36$.`, why:`Map each point, then take the product.`}
      ],
      answer:`Both give $36$; the kernel matches the feature map.` },

    { q:`<p>Gaussian kernel with $\\sigma=2$. Points at distance $2$ give $\\lVert x-z\\rVert^2 = 4$. Compute $K$.</p>`,
      steps:[
        {do:`$2\\sigma^2 = 2\\times 2^2 = 8$.`, why:`Compute the denominator with $\\sigma=2$.`},
        {do:`Exponent $= -\\frac{4}{8} = -0.5$.`, why:`Divide the squared distance by $2\\sigma^2$ and negate.`},
        {do:`$K = \\exp(-0.5) \\approx 0.607$.`, why:`Take $e$ to that power.`}
      ],
      answer:`$K = \\exp(-0.5) \\approx 0.607$.` },

    { q:`<p>Compare two Gaussian kernels at the same distance ($\\lVert x-z\\rVert^2 = 4$): one with $\\sigma=1$, one with $\\sigma=3$. Which gives the larger $K$?</p>`,
      steps:[
        {do:`$\\sigma=1$: exponent $-\\frac{4}{2} = -2$, $K=\\exp(-2)\\approx 0.135$.`, why:`Small $\\sigma$ makes the bump narrow, so distant points score low.`},
        {do:`$\\sigma=3$: exponent $-\\frac{4}{18}\\approx -0.22$, $K\\approx 0.80$.`, why:`Large $\\sigma$ makes the bump wide, so the same distance scores higher.`}
      ],
      answer:`The $\\sigma=3$ kernel ($\\approx 0.80$ vs $\\approx 0.135$).` },

    { q:`<p>Polynomial kernel $K(x,z)=(x^\\top z)^2$ with $x=(1,2)$, $z=(2,1)$. Evaluate $K$.</p>`,
      steps:[
        {do:`Dot product: $1\\times2 + 2\\times1 = 2 + 2 = 4$.`, why:`Compute the inner product first.`},
        {do:`Square: $4^2 = 16$.`, why:`The kernel squares the result.`}
      ],
      answer:`$K = 16$.` }
  ],

  "ml-gda": [
    { q:`<p>GDA models each class as a bell curve. Adults have mean $170$ cm, children mean $130$ cm. A person is $128$ cm. Which mean is closer?</p>`,
      steps:[
        {do:`Distance to child: $|128-130| = 2$.`, why:`Closeness to a bell curve's center raises its likelihood.`},
        {do:`Distance to adult: $|128-170| = 42$.`, why:`Far from a center means low likelihood.`},
        {do:`$2 &lt; 42$.`, why:`The closer center explains the point better.`}
      ],
      answer:`Child (much closer to the child mean).` },

    { q:`<p>GDA uses Bayes' rule $p(y\\mid x)=\\frac{p(x\\mid y)\\,p(y)}{p(x)}$. To pick the winning class, which part can we ignore?</p>`,
      steps:[
        {do:`The bottom $p(x)$ is the same for every class.`, why:`It does not depend on $y$, so it cannot change which class is largest.`},
        {do:`Compare only the tops $p(x\\mid y)\\,p(y)$.`, why:`The class with the biggest top wins.`}
      ],
      answer:`Ignore the denominator $p(x)$.` },

    { q:`<p>Two classes have equal priors $p(y=0)=p(y=1)=0.5$. The likelihoods are $p(x\\mid 0)=0.02$ and $p(x\\mid 1)=0.08$. Which class wins?</p>`,
      steps:[
        {do:`Class 0 top: $0.5\\times0.02 = 0.01$.`, why:`Multiply prior by likelihood (Bayes' numerator).`},
        {do:`Class 1 top: $0.5\\times0.08 = 0.04$.`, why:`Same product for the other class.`},
        {do:`$0.04 &gt; 0.01$.`, why:`The bigger numerator wins.`}
      ],
      answer:`Class 1.` },

    { q:`<p>Priors differ: $p(y=0)=0.9$, $p(y=1)=0.1$. Likelihoods $p(x\\mid 0)=0.1$, $p(x\\mid 1)=0.5$. Which class wins?</p>`,
      steps:[
        {do:`Class 0 top: $0.9\\times0.1 = 0.09$.`, why:`Prior times likelihood.`},
        {do:`Class 1 top: $0.1\\times0.5 = 0.05$.`, why:`Same for class 1.`},
        {do:`$0.09 &gt; 0.05$.`, why:`The common class wins even with a lower likelihood.`}
      ],
      answer:`Class 0 (the strong prior tips it).` },

    { q:`<p>GDA is a generative model. In one line, how does it differ from logistic regression (a discriminative model)?</p>`,
      steps:[
        {do:`Generative: model what each class looks like, $p(x\\mid y)$, then flip with Bayes.`, why:`GDA fits a bell curve per class first.`},
        {do:`Discriminative: model the boundary $p(y\\mid x)$ directly.`, why:`Logistic regression skips modeling $x$.`}
      ],
      answer:`GDA models each class's shape then uses Bayes; logistic regression learns the boundary directly.` },

    { q:`<p>A 1D Gaussian for a class has mean $\\mu=5$. A point at $x=5$ sits at the peak. Is $p(x\\mid y)$ at its largest or smallest there?</p>`,
      steps:[
        {do:`A bell curve peaks at its mean.`, why:`The Gaussian's highest density is at the center.`},
        {do:`$x=5=\\mu$ is the center.`, why:`So this point gets the maximum density.`}
      ],
      answer:`Largest (the point is at the peak).` },

    { q:`<p>GDA shares one covariance $\\Sigma$ across classes. What shape does this make the decision boundary between two classes?</p>`,
      steps:[
        {do:`Shared $\\Sigma$ means the bell curves have the same shape and spread.`, why:`Only the centers differ.`},
        {do:`Equal-spread Gaussians give a straight (linear) boundary.`, why:`The quadratic terms cancel, leaving a line.`}
      ],
      answer:`A straight (linear) boundary.` },

    { q:`<p>Estimate the class mean $\\mu$ for class $1$ from its points: $x = 4, 6, 8$ (one feature).</p>`,
      steps:[
        {do:`Sum the points: $4 + 6 + 8 = 18$.`, why:`The mean is the average of the class's points.`},
        {do:`Divide by count: $18/3 = 6$.`, why:`Three points, so divide by 3.`}
      ],
      answer:`$\\mu = 6$.` },

    { q:`<p>Estimate the prior $p(y=1)$ when the training set has $30$ examples of class $1$ and $70$ of class $0$.</p>`,
      steps:[
        {do:`Total examples: $30 + 70 = 100$.`, why:`The prior is a class's share of all data.`},
        {do:`$p(y=1) = 30/100 = 0.3$.`, why:`Fraction of examples in class 1.`}
      ],
      answer:`$p(y=1) = 0.3$.` },

    { q:`<p>Two classes, equal priors and equal spread. Class $0$ mean $=0$, class $1$ mean $=10$. A new point is $x=4$. Which class does GDA pick?</p>`,
      steps:[
        {do:`Distance to mean 0: $|4-0| = 4$.`, why:`Closer mean gives higher likelihood.`},
        {do:`Distance to mean 10: $|4-10| = 6$.`, why:`Farther mean gives lower likelihood.`},
        {do:`$4 &lt; 6$, and priors and spreads are equal.`, why:`With ties elsewhere, the nearer mean wins.`}
      ],
      answer:`Class 0 (boundary is at the midpoint $x=5$).` }
  ],

  "ml-naive-bayes": [
    { q:`<p>Naive Bayes assumes features are independent given the class. For two features, how do you get $P(x\\mid y)$?</p>`,
      steps:[
        {do:`Multiply: $P(x\\mid y) = P(x_1\\mid y)\\times P(x_2\\mid y)$.`, why:`Independence turns a joint probability into a product.`},
        {do:`Use this product for each class.`, why:`Each class has its own feature probabilities.`}
      ],
      answer:`$P(x\\mid y) = P(x_1\\mid y)\\,P(x_2\\mid y)$.` },

    { q:`<p>Spam filter. The word "free" has $P(\\text{free}\\mid\\text{spam})=0.6$ and $P(\\text{free}\\mid\\text{ham})=0.1$. Ignoring priors, which class does "free" favor?</p>`,
      steps:[
        {do:`Compare likelihoods: $0.6$ vs $0.1$.`, why:`Higher likelihood under a class favors that class.`},
        {do:`$0.6 &gt; 0.1$.`, why:`"free" is much more common in spam.`}
      ],
      answer:`Spam.` },

    { q:`<p>$P(\\text{spam})=0.5$, $P(\\text{ham})=0.5$. An email has word "win": $P(\\text{win}\\mid\\text{spam})=0.4$, $P(\\text{win}\\mid\\text{ham})=0.05$. Spam or ham?</p>`,
      steps:[
        {do:`Spam score: $0.5\\times0.4 = 0.20$.`, why:`Prior times likelihood (Naive Bayes uses a product).`},
        {do:`Ham score: $0.5\\times0.05 = 0.025$.`, why:`Same product for ham.`},
        {do:`$0.20 &gt; 0.025$.`, why:`The bigger score wins.`}
      ],
      answer:`Spam (score $0.20$ vs $0.025$).` },

    { q:`<p>$P(\\text{spam})=0.3$, $P(\\text{ham})=0.7$. Word "free": $P(\\text{free}\\mid\\text{spam})=0.8$, $P(\\text{free}\\mid\\text{ham})=0.2$. Classify.</p>`,
      steps:[
        {do:`Spam score: $0.3\\times0.8 = 0.24$.`, why:`Multiply prior by likelihood.`},
        {do:`Ham score: $0.7\\times0.2 = 0.14$.`, why:`Same for ham.`},
        {do:`$0.24 &gt; 0.14$.`, why:`Spam has the larger product.`}
      ],
      answer:`Spam (score $0.24$ vs $0.14$).` },

    { q:`<p>Two words appear. Spam: $P(w_1\\mid\\text{spam})=0.5$, $P(w_2\\mid\\text{spam})=0.4$. Find the spam likelihood of both words.</p>`,
      steps:[
        {do:`Multiply the two: $0.5\\times0.4$.`, why:`Independence lets us multiply feature likelihoods.`},
        {do:`$= 0.20$.`, why:`Product of the two probabilities.`}
      ],
      answer:`$P(\\text{both}\\mid\\text{spam}) = 0.20$.` },

    { q:`<p>An email has words "free" and "win". Spam: $P(\\text{free}\\mid s)=0.8$, $P(\\text{win}\\mid s)=0.5$, prior $P(s)=0.4$. Compute the unnormalized spam score.</p>`,
      steps:[
        {do:`Multiply likelihoods: $0.8\\times0.5 = 0.4$.`, why:`Combine the two word probabilities.`},
        {do:`Times the prior: $0.4\\times0.4 = 0.16$.`, why:`Naive Bayes multiplies prior by all feature likelihoods.`}
      ],
      answer:`Spam score $= 0.16$.` },

    { q:`<p>Continue: for ham, $P(\\text{free}\\mid h)=0.1$, $P(\\text{win}\\mid h)=0.05$, prior $P(h)=0.6$. Compute the ham score and classify.</p>`,
      steps:[
        {do:`Likelihoods: $0.1\\times0.05 = 0.005$.`, why:`Multiply the two word probabilities.`},
        {do:`Times prior: $0.005\\times0.6 = 0.003$.`, why:`Include the class prior.`},
        {do:`Compare to spam $0.16$: $0.16 &gt; 0.003$.`, why:`The bigger score wins.`}
      ],
      answer:`Spam (score $0.16$ vs $0.003$).` },

    { q:`<p>A word never appeared in spam during training, so $P(w\\mid\\text{spam})=0$. Why is that a problem, and what fixes it?</p>`,
      steps:[
        {do:`A single $0$ makes the whole product $0$.`, why:`Multiplying anything by $0$ wipes out the score.`},
        {do:`Add a small count to every word (Laplace smoothing).`, why:`This keeps probabilities away from exactly $0$.`}
      ],
      answer:`A zero kills the product; Laplace smoothing fixes it.` },

    { q:`<p>Laplace smoothing: word "cheap" appeared $0$ times in $4$ spam emails, over a vocabulary of $2$ words. Estimate $P(\\text{cheap}\\mid\\text{spam})$ as $\\frac{\\text{count}+1}{\\text{total}+V}$ with $V=2$.</p>`,
      steps:[
        {do:`Numerator: count $+1 = 0 + 1 = 1$.`, why:`Add-one smoothing bumps every count by 1.`},
        {do:`Denominator: total $+V = 4 + 2 = 6$.`, why:`Add $V$ (vocabulary size) to keep it a valid probability.`},
        {do:`$P = 1/6 \\approx 0.167$.`, why:`Divide.`}
      ],
      answer:`$P(\\text{cheap}\\mid\\text{spam}) = 1/6 \\approx 0.167$.` },

    { q:`<p>To compare classes we often use the spam-to-ham ratio. Spam score $0.24$, ham score $0.06$. What is the ratio, and what does it mean?</p>`,
      steps:[
        {do:`Ratio $= 0.24 / 0.06 = 4$.`, why:`Dividing the two scores compares them without normalizing.`},
        {do:`Ratio $&gt; 1$ means spam is favored.`, why:`Spam is $4$ times more likely than ham here.`}
      ],
      answer:`Ratio $=4$; spam is $4\\times$ more likely.` }
  ],

  "ml-trees": [
    { q:`<p>A group has all one class (10 buyers, 0 non-buyers). Compute its Gini impurity $1-\\sum_c p_c^2$.</p>`,
      steps:[
        {do:`Fractions: buyers $=1$, non-buyers $=0$.`, why:`All examples are one class.`},
        {do:`Gini $= 1 - (1^2 + 0^2) = 1 - 1 = 0$.`, why:`A pure group has Gini $0$.`}
      ],
      answer:`Gini $= 0$ (perfectly pure).` },

    { q:`<p>A group is evenly split: 5 yes, 5 no. Compute the Gini impurity.</p>`,
      steps:[
        {do:`Fractions: $0.5$ and $0.5$.`, why:`Half the group is each class.`},
        {do:`Gini $= 1 - (0.5^2 + 0.5^2) = 1 - 0.5 = 0.5$.`, why:`An even 2-class split gives the maximum Gini of $0.5$.`}
      ],
      answer:`Gini $= 0.5$ (maximally mixed).` },

    { q:`<p>A group has 8 yes and 2 no (10 total). Compute its Gini impurity.</p>`,
      steps:[
        {do:`Fractions: $0.8$ and $0.2$.`, why:`Divide each class count by the total.`},
        {do:`Gini $= 1 - (0.8^2 + 0.2^2) = 1 - (0.64 + 0.04) = 0.32$.`, why:`Sum the squared fractions and subtract from 1.`}
      ],
      answer:`Gini $= 0.32$.` },

    { q:`<p>Compute the entropy of a group that is 50/50 (two classes), using $-\\sum_c p_c\\log_2 p_c$.</p>`,
      steps:[
        {do:`Fractions: $0.5$ and $0.5$.`, why:`Even split.`},
        {do:`Entropy $= -(0.5\\log_2 0.5 + 0.5\\log_2 0.5) = -(0.5(-1)+0.5(-1))$.`, why:`Note $\\log_2 0.5 = -1$.`},
        {do:`$= 1$.`, why:`A 50/50 split has the maximum entropy of $1$ bit.`}
      ],
      answer:`Entropy $= 1$ bit.` },

    { q:`<p>Compute the entropy of a pure group (all one class) using $-\\sum_c p_c\\log_2 p_c$.</p>`,
      steps:[
        {do:`One class has $p=1$, the other $p=0$.`, why:`A pure group is all one class.`},
        {do:`Entropy $= -(1\\log_2 1) = -(1\\times 0) = 0$.`, why:`$\\log_2 1 = 0$, so the term vanishes; the $p=0$ class contributes nothing.`}
      ],
      answer:`Entropy $= 0$.` },

    { q:`<p>Before a split a group of 10 is 50/50, Gini $=0.5$. After splitting, both children have Gini $0.32$ and each holds 5 examples. What is the weighted child Gini?</p>`,
      steps:[
        {do:`Each child weight: $5/10 = 0.5$.`, why:`Weight by the share of examples in each child.`},
        {do:`Weighted Gini $= 0.5\\times0.32 + 0.5\\times0.32 = 0.32$.`, why:`Average the children's Gini by their sizes.`}
      ],
      answer:`Weighted child Gini $= 0.32$.` },

    { q:`<p>Continue: parent Gini $=0.5$, weighted child Gini $=0.32$. What is the Gini gain from this split?</p>`,
      steps:[
        {do:`Gain $=$ parent $-$ child $= 0.5 - 0.32$.`, why:`Gain measures how much impurity the split removed.`},
        {do:`$= 0.18$.`, why:`Subtract.`}
      ],
      answer:`Gini gain $= 0.18$.` },

    { q:`<p>Two candidate splits: split A drops weighted Gini to $0.30$, split B to $0.20$. Parent Gini is $0.50$. Which split does the tree pick?</p>`,
      steps:[
        {do:`Gain A: $0.50 - 0.30 = 0.20$.`, why:`Bigger gain means purer children.`},
        {do:`Gain B: $0.50 - 0.20 = 0.30$.`, why:`Same calculation for B.`},
        {do:`$0.30 &gt; 0.20$.`, why:`The tree greedily picks the larger gain.`}
      ],
      answer:`Split B (gain $0.30$ vs $0.20$).` },

    { q:`<p>A split sends 6 examples left (all class A) and 4 right (all class B). What is the weighted Gini of the children, and is this a perfect split?</p>`,
      steps:[
        {do:`Left Gini $=0$ (pure), right Gini $=0$ (pure).`, why:`Each child is all one class.`},
        {do:`Weighted: $0.6\\times0 + 0.4\\times0 = 0$.`, why:`Weighted average of two zeros is zero.`}
      ],
      answer:`Weighted Gini $=0$; yes, a perfect split.` },

    { q:`<p>A leaf node holds 3 examples: 2 class "yes", 1 class "no". A new point lands here. What does the tree predict, and what is the leaf's Gini?</p>`,
      steps:[
        {do:`Predict the majority class: "yes" (2 vs 1).`, why:`A leaf predicts its most common class.`},
        {do:`Gini $= 1 - ((2/3)^2 + (1/3)^2) = 1 - (4/9 + 1/9) = 1 - 5/9 \\approx 0.444$.`, why:`Compute impurity from the fractions.`}
      ],
      answer:`Predict "yes"; leaf Gini $\\approx 0.444$.` }
  ],

  "ml-ensembles": [
    { q:`<p>Five trees vote on spam: yes, yes, no, yes, yes. What does the forest predict by majority?</p>`,
      steps:[
        {do:`Count: 4 yes, 1 no.`, why:`Bagging uses a majority vote.`},
        {do:`$4 &gt; 1$.`, why:`The majority class wins.`}
      ],
      answer:`Spam (yes).` },

    { q:`<p>Three trees predict a house price: $\\$200$k, $\\$220$k, $\\$240$k. What does a random forest predict (averaging)?</p>`,
      steps:[
        {do:`Sum: $200 + 220 + 240 = 660$.`, why:`Bagging averages the members for regression.`},
        {do:`Divide by 3: $660/3 = 220$.`, why:`Three trees, so divide by 3.`}
      ],
      answer:`$\\$220$k.` },

    { q:`<p>Bagging trains trees on random subsets and averages them. Does this mainly reduce bias or variance?</p>`,
      steps:[
        {do:`Each tree sees different data, so their errors differ.`, why:`Averaging independent errors cancels them out.`},
        {do:`Averaging shrinks the spread of predictions.`, why:`Less spread means lower variance.`}
      ],
      answer:`It mainly reduces variance.` },

    { q:`<p>Boosting combines weighted trees: $\\hat y = \\sum_t \\alpha_t h_t(x)$. With $\\alpha_1=0.5$, $h_1=1$ and $\\alpha_2=0.3$, $h_2=-1$, compute the raw score.</p>`,
      steps:[
        {do:`Term 1: $0.5\\times1 = 0.5$.`, why:`Multiply each tree's weight by its output.`},
        {do:`Term 2: $0.3\\times(-1) = -0.3$.`, why:`Same for the second tree.`},
        {do:`Sum: $0.5 + (-0.3) = 0.2$.`, why:`Add the weighted votes.`}
      ],
      answer:`Raw score $= 0.2$.` },

    { q:`<p>Continue: the boosted raw score is $0.2$. The class is $\\text{sign}(\\hat y)$. What class?</p>`,
      steps:[
        {do:`The raw score is $0.2$, which is positive.`, why:`Boosting decides the class by the sign of the weighted sum.`},
        {do:`$\\text{sign}(0.2) = +1$.`, why:`Positive scores map to the $+1$ class.`}
      ],
      answer:`Class $+1$.` },

    { q:`<p>In boosting, each new tree focuses on the previous trees' mistakes. How does it do this?</p>`,
      steps:[
        {do:`Misclassified examples get larger weights.`, why:`Boosting up-weights the hard cases.`},
        {do:`The next tree is trained to fix those weighted mistakes.`, why:`Sequential trees correct earlier errors.`}
      ],
      answer:`By up-weighting misclassified examples so the next tree targets them.` },

    { q:`<p>Bagging vs boosting: which trains trees in parallel (independently) and which trains them in sequence?</p>`,
      steps:[
        {do:`Bagging trees see independent random subsets.`, why:`No tree depends on another, so they can train in parallel.`},
        {do:`Boosting trees each depend on the prior ones' errors.`, why:`Each must wait for the previous, so it is sequential.`}
      ],
      answer:`Bagging is parallel; boosting is sequential.` },

    { q:`<p>An AdaBoost tree has error rate $\\epsilon=0.25$. Its weight is $\\alpha=\\tfrac12\\ln\\frac{1-\\epsilon}{\\epsilon}$. Compute $\\alpha$.</p>`,
      steps:[
        {do:`Ratio: $\\frac{1-0.25}{0.25} = \\frac{0.75}{0.25} = 3$.`, why:`A lower error gives a bigger ratio, hence more weight.`},
        {do:`$\\alpha = \\tfrac12\\ln 3 \\approx \\tfrac12(1.099) \\approx 0.549$.`, why:`Take the log and halve it.`}
      ],
      answer:`$\\alpha \\approx 0.549$.` },

    { q:`<p>An AdaBoost tree is no better than guessing: $\\epsilon=0.5$. Its weight is $\\tfrac12\\ln\\frac{1-\\epsilon}{\\epsilon}$. What is $\\alpha$?</p>`,
      steps:[
        {do:`Ratio: $\\frac{1-0.5}{0.5} = \\frac{0.5}{0.5} = 1$.`, why:`A coin-flip learner has equal right and wrong rates.`},
        {do:`$\\alpha = \\tfrac12\\ln 1 = \\tfrac12\\times 0 = 0$.`, why:`$\\ln 1 = 0$, so this tree gets zero say.`}
      ],
      answer:`$\\alpha = 0$ (a useless tree is ignored).` },

    { q:`<p>Four trees give probabilities of spam: $0.9, 0.8, 0.2, 0.7$. A soft-voting forest averages them, then thresholds at $0.5$. Spam or not?</p>`,
      steps:[
        {do:`Average: $(0.9+0.8+0.2+0.7)/4 = 2.6/4 = 0.65$.`, why:`Soft voting averages the predicted probabilities.`},
        {do:`$0.65 &gt; 0.5$.`, why:`Above the threshold means predict spam.`}
      ],
      answer:`Spam (average $0.65$).` }
  ],

  "ml-knn": [
    { q:`<p>1D points: apples at $10, 12$; oranges at $20, 22$. New point at $13$ with $k=1$. Classify it.</p>`,
      steps:[
        {do:`Distances: $|13-10|=3$, $|13-12|=1$, $|13-20|=7$, $|13-22|=9$.`, why:`k-NN finds the nearest stored points.`},
        {do:`Smallest is $1$ (the apple at 12).`, why:`With $k=1$, take the single closest neighbor's label.`}
      ],
      answer:`Apple.` },

    { q:`<p>Fruits by weight: apples at $100, 110, 120$ g; oranges at $150, 160$ g. New fruit $115$ g, $k=3$. Classify.</p>`,
      steps:[
        {do:`Distances: $15, 5, 5, 35, 45$.`, why:`Compute distance to every stored point.`},
        {do:`3 closest: $110, 120, 100$ (all apples).`, why:`Keep the $k=3$ smallest distances.`},
        {do:`Vote: 3 apples vs 0 oranges.`, why:`Majority of the neighbors wins.`}
      ],
      answer:`Apple.` },

    { q:`<p>Compute the Euclidean distance between query $x=(0,0)$ and neighbor $(3,4)$.</p>`,
      steps:[
        {do:`Differences: $3-0=3$, $4-0=4$.`, why:`Subtract coordinate by coordinate.`},
        {do:`$\\sqrt{3^2 + 4^2} = \\sqrt{9+16} = \\sqrt{25} = 5$.`, why:`Euclidean distance is the root of summed squares.`}
      ],
      answer:`Distance $= 5$.` },

    { q:`<p>Query $(1,1)$. Neighbors: A$(2,1)$ class red, B$(1,4)$ class blue, C$(0,1)$ class red. With $k=3$, classify the query.</p>`,
      steps:[
        {do:`Distances: A $\\sqrt{1}=1$, B $\\sqrt{9}=3$, C $\\sqrt{1}=1$.`, why:`Euclidean distance to each neighbor.`},
        {do:`All 3 are used ($k=3$): red, blue, red.`, why:`Collect the labels of the $k$ nearest.`},
        {do:`Vote: 2 red, 1 blue.`, why:`Majority wins.`}
      ],
      answer:`Red.` },

    { q:`<p>k-NN regression. The 3 nearest neighbors have target values $8, 10, 12$. Predict the query's value.</p>`,
      steps:[
        {do:`Average: $(8+10+12)/3 = 30/3$.`, why:`For regression, k-NN averages the neighbors' values.`},
        {do:`$= 10$.`, why:`Divide by 3.`}
      ],
      answer:`Predicted value $= 10$.` },

    { q:`<p>A query has 5 neighbors: 3 cats, 2 dogs. With $k=5$, what is predicted, and how confident (as a fraction) is the vote?</p>`,
      steps:[
        {do:`Majority: 3 cats vs 2 dogs.`, why:`The most common class among neighbors wins.`},
        {do:`Confidence $= 3/5 = 0.6$.`, why:`Fraction of neighbors voting for the winner.`}
      ],
      answer:`Cat, with confidence $0.6$.` },

    { q:`<p>You raise $k$ from $1$ to $25$. Does the decision boundary get smoother or jumpier? More bias or more variance?</p>`,
      steps:[
        {do:`Larger $k$ averages over more neighbors.`, why:`More neighbors smooth out individual noise.`},
        {do:`Smoothing raises bias and lowers variance.`, why:`The model becomes simpler and less sensitive to single points.`}
      ],
      answer:`Smoother; more bias, less variance.` },

    { q:`<p>With $k=2$ a vote can tie (1 vs 1). Why is an odd $k$ often preferred for 2-class problems?</p>`,
      steps:[
        {do:`Even $k$ can split evenly between two classes.`, why:`A tie has no clear majority.`},
        {do:`Odd $k$ cannot tie between two classes.`, why:`An odd count always has a strict majority.`}
      ],
      answer:`Odd $k$ avoids ties in 2-class voting.` },

    { q:`<p>Feature scaling matters. Query $(0,0)$. Neighbor A is $(1, 100)$, neighbor B is $(2, 0)$. Which is "nearer" by Euclidean distance, and why is this a warning?</p>`,
      steps:[
        {do:`A: $\\sqrt{1^2+100^2}\\approx 100$. B: $\\sqrt{2^2+0^2}=2$.`, why:`Compute both distances.`},
        {do:`B is nearer, but only because feature 2's large scale dominated A.`, why:`Unscaled features with big ranges swamp the distance.`}
      ],
      answer:`B is nearer; this shows why features should be scaled first.` },

    { q:`<p>Distance-weighted k-NN. Three neighbors vote with weights $1/d$: cat at $d=1$, dog at $d=2$, dog at $d=4$. Which class wins?</p>`,
      steps:[
        {do:`Cat weight: $1/1 = 1$.`, why:`Closer neighbors get more say via $1/d$.`},
        {do:`Dog weight: $1/2 + 1/4 = 0.5 + 0.25 = 0.75$.`, why:`Sum the dog neighbors' weights.`},
        {do:`$1 &gt; 0.75$.`, why:`The class with more total weight wins.`}
      ],
      answer:`Cat (weight $1$ vs $0.75$).` }
  ],

  "ml-bias-variance": [
    { q:`<p>A model has low training error AND low test error. Is it underfit, overfit, or well-fit?</p>`,
      steps:[
        {do:`Low error on both training and new data.`, why:`Good test performance means it generalizes.`},
        {do:`Neither symptom of under- nor over-fitting is present.`, why:`No big gap, no high error.`}
      ],
      answer:`Well-fit (good balance).` },

    { q:`<p>A model has high training error and high test error. Is this high bias or high variance? Under- or over-fit?</p>`,
      steps:[
        {do:`Both errors high means the model misses the pattern even on training data.`, why:`A too-simple model cannot fit the data at all.`},
        {do:`That is high bias.`, why:`High bias means underfitting.`}
      ],
      answer:`High bias (underfitting).` },

    { q:`<p>A model scores nearly $0$ training error but high test error. High bias or high variance? Under- or over-fit?</p>`,
      steps:[
        {do:`It nailed training but fails on new data.`, why:`It memorized noise instead of the real pattern.`},
        {do:`A big train-test gap means high variance.`, why:`High variance means overfitting.`}
      ],
      answer:`High variance (overfitting).` },

    { q:`<p>Test error splits as $\\text{bias}^2 + \\text{variance} + \\text{noise}$. With $\\text{bias}=2$, $\\text{variance}=3$, $\\text{noise}=1$, compute the total.</p>`,
      steps:[
        {do:`$\\text{bias}^2 = 2^2 = 4$.`, why:`The formula squares the bias term.`},
        {do:`Total $= 4 + 3 + 1 = 8$.`, why:`Add the three parts.`}
      ],
      answer:`Total expected test error $= 8$.` },

    { q:`<p>You fit polynomials of growing degree. As the degree rises, what happens to bias and to variance?</p>`,
      steps:[
        {do:`Higher degree bends more flexibly.`, why:`Flexibility lets the curve match the data closely.`},
        {do:`Bias falls, variance rises.`, why:`More flexible models fit better but react more to noise.`}
      ],
      answer:`Bias decreases; variance increases.` },

    { q:`<p>A decision tree is grown very deep until it perfectly fits training data. What will likely happen on test data, and which way should you adjust depth?</p>`,
      steps:[
        {do:`Perfect training fit signals overfitting (high variance).`, why:`A deep tree memorizes noise.`},
        {do:`Reduce depth to add bias and cut variance.`, why:`A shallower tree generalizes better.`}
      ],
      answer:`Test error rises; make the tree shallower.` },

    { q:`<p>Stronger regularization makes a model simpler. Does increasing regularization raise or lower variance? What about bias?</p>`,
      steps:[
        {do:`More regularization shrinks the weights, simplifying the model.`, why:`A simpler model is less sensitive to the training data.`},
        {do:`Variance falls, bias rises.`, why:`Simplicity trades flexibility for stability.`}
      ],
      answer:`Variance falls; bias rises.` },

    { q:`<p>Two models on the same task. Model A: train error $5\\%$, test error $7\\%$. Model B: train error $1\\%$, test error $15\\%$. Which is overfitting?</p>`,
      steps:[
        {do:`A's gap: $7\\% - 5\\% = 2\\%$.`, why:`A small gap means it generalizes well.`},
        {do:`B's gap: $15\\% - 1\\% = 14\\%$.`, why:`A large gap is the hallmark of overfitting.`}
      ],
      answer:`Model B (huge train-test gap).` },

    { q:`<p>The test-error curve over model complexity is U-shaped. What sits to the left of the bottom, and what sits to the right?</p>`,
      steps:[
        {do:`Left = too simple, high error from high bias.`, why:`Underfitting lives on the low-complexity side.`},
        {do:`Right = too complex, high error from high variance.`, why:`Overfitting lives on the high-complexity side.`}
      ],
      answer:`Left: underfitting (high bias). Right: overfitting (high variance).` },

    { q:`<p>Your model underfits (high bias). Which helps more: adding more training data, or adding more features / model complexity?</p>`,
      steps:[
        {do:`More data mostly cuts variance, not bias.`, why:`A too-simple model stays too simple no matter how much data it sees.`},
        {do:`Adding complexity or features lowers bias.`, why:`A richer model can capture the missed pattern.`}
      ],
      answer:`Add complexity/features (more data barely helps high bias).` }
  ],

  "ml-learning-theory": [
    { q:`<p>A classifier gets $3$ wrong out of $20$ training examples. Compute its training error $\\hat\\epsilon = \\frac{1}{m}\\sum 1\\{\\text{mistake}\\}$.</p>`,
      steps:[
        {do:`Count mistakes: $3$.`, why:`The indicator adds $1$ per wrong prediction.`},
        {do:`$\\hat\\epsilon = 3/20 = 0.15$.`, why:`Divide mistakes by the number of examples $m=20$.`}
      ],
      answer:`$\\hat\\epsilon = 0.15$ ($15\\%$).` },

    { q:`<p>A model is right on $45$ of $50$ training examples. What is its training error rate?</p>`,
      steps:[
        {do:`Mistakes: $50 - 45 = 5$.`, why:`Wrong $=$ total minus correct.`},
        {do:`$\\hat\\epsilon = 5/50 = 0.1$.`, why:`Divide by $m=50$.`}
      ],
      answer:`$\\hat\\epsilon = 0.1$ ($10\\%$).` },

    { q:`<p>Learning theory says training error becomes a trustworthy estimate of true error when what two things hold?</p>`,
      steps:[
        {do:`More training data: $m$ is large.`, why:`More examples shrink the gap between train and true error.`},
        {do:`Simpler model class: low VC dimension.`, why:`Less flexible classes are harder to fool with noise.`}
      ],
      answer:`Large $m$ and a low-complexity (low VC dimension) model class.` },

    { q:`<p>The VC dimension of straight-line (linear) classifiers in 2D is $3$. In plain terms, what does "VC dimension $=3$" mean?</p>`,
      steps:[
        {do:`A line can perfectly separate (shatter) any labeling of $3$ well-placed points.`, why:`VC dimension is the largest set size the class can always split correctly.`},
        {do:`But there exist $4$ points it cannot shatter (e.g. the XOR layout).`, why:`Beyond the VC dimension, some labeling defeats the class.`}
      ],
      answer:`A line can shatter $3$ points but not $4$.` },

    { q:`<p>With $n$ binary features, how many distinct inputs $x$ are possible? (Each feature is $0$ or $1$.)</p>`,
      steps:[
        {do:`Each feature has $2$ choices, and there are $n$ of them.`, why:`Independent choices multiply.`},
        {do:`Total $= 2^n$.`, why:`Two options raised to $n$ features.`}
      ],
      answer:`$2^n$ distinct inputs.` },

    { q:`<p>With $3$ binary features, how many possible inputs are there?</p>`,
      steps:[
        {do:`Use $2^n$ with $n=3$.`, why:`Each of the 3 features is 0 or 1.`},
        {do:`$2^3 = 8$.`, why:`Compute the power.`}
      ],
      answer:`$8$ inputs.` },

    { q:`<p>A hypothesis class has $|H| = 16$ candidate models. How many bits does it take to name one (using $\\log_2 |H|$)?</p>`,
      steps:[
        {do:`We need $\\log_2 16$.`, why:`Naming one of $|H|$ choices takes $\\log_2|H|$ bits.`},
        {do:`$\\log_2 16 = 4$.`, why:`Because $2^4 = 16$.`}
      ],
      answer:`$4$ bits.` },

    { q:`<p>Two models have the same training error. One is from a simple class, one from a very flexible class. Which generalizes better, by learning theory?</p>`,
      steps:[
        {do:`Same training error, so compare complexity.`, why:`The generalization gap grows with model complexity.`},
        {do:`The simpler class has the smaller gap.`, why:`Lower complexity (lower VC dimension) means a tighter bound.`}
      ],
      answer:`The simpler model generalizes better.` },

    { q:`<p>You double the training set from $m=100$ to $m=200$. The generalization gap bound scales like $1/\\sqrt{m}$. By what factor does the bound shrink?</p>`,
      steps:[
        {do:`Ratio of bounds: $\\frac{1/\\sqrt{200}}{1/\\sqrt{100}} = \\frac{\\sqrt{100}}{\\sqrt{200}}$.`, why:`Divide the new bound by the old.`},
        {do:`$= \\sqrt{100/200} = \\sqrt{0.5} \\approx 0.707$.`, why:`Simplify under one root.`}
      ],
      answer:`It shrinks to about $0.707\\times$ (a factor of $1/\\sqrt{2}$).` },

    { q:`<p>How many distinct boolean functions exist on $2$ binary inputs? (There are $2^2=4$ input rows, each mapping to $0$ or $1$.)</p>`,
      steps:[
        {do:`Input rows: $2^2 = 4$.`, why:`Two binary features give 4 input rows.`},
        {do:`Each of the $4$ rows maps to $0$ or $1$: $2^4 = 16$.`, why:`Each row's output is an independent binary choice.`}
      ],
      answer:`$16$ boolean functions.` }
  ]

}); })();
