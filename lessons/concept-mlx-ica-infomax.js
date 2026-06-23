/* Machine Learning — more.
   The Bell-Sejnowski (infomax) maximum-likelihood LEARNING ALGORITHM for ICA.
   ml-ica teaches the ICA *concept* (cocktail party, x = As, W = A^-1, non-Gaussianity);
   THIS lesson teaches how to actually LEARN W by gradient ascent on the log-likelihood.
   Self-contained: lesson + CODE + CODEVIZ merged by id "mlx-ica-infomax". */
(function () {
  window.LESSONS.push({
    id: "mlx-ica-infomax",
    title: "ICA: the Bell-Sejnowski (infomax) algorithm",
    tagline: "Learn the unmixing matrix W by gradient ascent on the log-likelihood of the data.",
    module: "Machine Learning — more",
    prereqs: ["ml-ica", "fnd-gradient", "ml-likelihood", "la-determinant", "la-inverse"],

    bigIdea:
      `<p>The <code>ml-ica</code> lesson sets up the problem: recordings $x = As$ are a blend of
       independent sources $s$, and to unmix them we need the <b>unmixing matrix</b>
       $W = A^{-1}$ so that $\\hat{s} = Wx$. But it stops at "ICA finds the $W$ that makes the
       outputs independent" without saying <i>how</i>. This lesson is the <b>how</b>.</p>
       <p>The <b>Bell-Sejnowski</b> algorithm (also called <b>infomax</b>) turns the search for $W$
       into ordinary <b>maximum likelihood</b>: pick the $W$ that makes the observed recordings most
       probable. We write down the probability of the data as a function of $W$, take the log, and
       climb it with <b>gradient ascent</b>. Each step nudges $W$ uphill until the recovered signals
       look like independent, non-Gaussian sources.</p>
       <p>Two pieces make this work and are the heart of the lesson: a
       $\\log\\lvert W\\rvert$ term that appears because we are transforming a probability density
       (the change-of-variables Jacobian, see <code>probx-derived</code> and
       <code>la-determinant</code>), and a $(W^{\\top})^{-1}$ term in the gradient that keeps $W$
       invertible &mdash; a real unmixing matrix.</p>`,

    buildup:
      `<p>Start from a <b>model of one recording</b>. We assume the sources $s = Wx$ are independent,
       so their joint density factorizes into a product, one factor per source:
       $p(s) = \\prod_{i=1}^{n} p_s(s_i)$. We have to pick a shape $p_s$ for a single source &mdash;
       a <b>prior</b> on what one source's values look like.</p>
       <ol class="steps">
         <li><b>Choose the source prior through the sigmoid.</b> The sigmoid
          $g(z) = \\frac{1}{1+e^{-z}}$ is an S-shaped curve that rises from 0 to 1, so it works as a
          <b>cumulative distribution function (CDF)</b> &mdash; the running total of probability up to
          $z$. The probability density of one source is then its derivative $g'(z)$, a peaky,
          heavy-tailed bump. We assume each source is distributed like $g'$: $p_s(s_i) = g'(s_i)$.
          This is a deliberately <b>non-Gaussian</b> choice (more on why below).</li>
         <li><b>Push the density through the transform $s = Wx$.</b> Going from the density of $s$ to
          the density of $x$ is a <b>change of variables</b>. When you stretch or squeeze a coordinate,
          probability density rescales by the <b>Jacobian determinant</b> &mdash; here that factor is
          $\\lvert W\\rvert$, the absolute value of the determinant of $W$. That gives the density of one
          recording under $W$.</li>
         <li><b>Sum the log over all $m$ examples.</b> Take the log (products become sums, which is
          easier to differentiate) and add up over the data set. That is the <b>log-likelihood</b>
          $\\ell(W)$ &mdash; one number saying how well this $W$ explains all the recordings.</li>
         <li><b>Climb it.</b> Differentiate $\\ell(W)$ with respect to $W$ and take small
          <b>gradient-ascent</b> steps (ascent, not descent &mdash; we are <i>maximizing</i> a
          likelihood, see <code>fnd-gradient</code> and <code>ml-likelihood</code>). The gradient has
          a clean closed form; that update rule is the algorithm.</li>
       </ol>`,

    symbols: [
      { sym: "$W$", desc: "the unmixing matrix we are learning ($n\\times n$). Apply it to recordings to recover sources: $\\hat{s} = Wx$. At convergence $W \\approx A^{-1}$." },
      { sym: "$w_j$", desc: "the $j$-th row of $W$ (written as a column so $w_j^{\\top}x$ is a number). It extracts the $j$-th recovered source from a recording." },
      { sym: "$x^{(i)}$", desc: "the $i$-th recording: a length-$n$ column vector of what the $n$ mics heard on example $i$. There are $m$ of them." },
      { sym: "$g$", desc: "the sigmoid $g(z) = 1/(1+e^{-z})$, used as the assumed cumulative distribution function (CDF) of a single source." },
      { sym: "$g'$", desc: "the derivative of the sigmoid, $g'(z) = g(z)(1-g(z))$ &mdash; the assumed probability density of one source (peaky, heavy-tailed, non-Gaussian)." },
      { sym: "$\\lvert W\\rvert$", desc: "the absolute value of the determinant of $W$: the change-of-variables (Jacobian) factor that rescales density when we transform $s = Wx$ (see la-determinant)." },
      { sym: "$\\alpha$", desc: "the learning rate (step size) of the gradient-ascent update &mdash; how far $W$ moves uphill each step." }
    ],

    formula:
      `$$ p(x) = \\prod_{i=1}^{n} p_s\\!\\left(w_i^{\\top} x\\right)\\,\\lvert W\\rvert
         \\qquad
         \\ell(W) = \\sum_{i=1}^{m}\\left( \\sum_{j=1}^{n} \\log g'\\!\\left(w_j^{\\top} x^{(i)}\\right) \\right) + \\log\\lvert W\\rvert $$
       $$ W \\leftarrow W + \\alpha\\left(
         \\begin{pmatrix} 1 - 2g(w_1^{\\top} x^{(i)}) \\\\ \\vdots \\\\ 1 - 2g(w_n^{\\top} x^{(i)}) \\end{pmatrix}
         x^{(i)\\top} + (W^{\\top})^{-1} \\right) $$`,

    whatItDoes:
      `<p>The <b>first equation</b> is the density of one recording under a candidate $W$. The product
       $\\prod_i p_s(w_i^{\\top}x)$ scores how source-like the recovered values are (independence
       baked in as a product over coordinates); the $\\lvert W\\rvert$ is the Jacobian factor that makes
       it a valid density after the transform $s = Wx$.</p>
       <p>The <b>second equation</b> is the <b>log-likelihood</b> over the whole data set &mdash; one
       scalar to maximize. Note where $g'$ appears: because we set the source density $p_s = g'$, the
       per-source term is $\\log g'(w_j^{\\top}x^{(i)})$, and the $\\log\\lvert W\\rvert$ Jacobian term
       sits outside the sum over sources.</p>
       <p>The <b>third equation</b> is the <b>stochastic gradient-ascent update</b>: the derivative of
       $\\ell$ for a single example $x^{(i)}$. The column vector $1 - 2g(\\cdot)$ is the "data fit"
       push from the source prior; the $(W^{\\top})^{-1}$ is the gradient of the $\\log\\lvert W\\rvert$
       term, and it pushes $W$ to stay <b>invertible</b>. We add $\\alpha$ times this gradient because
       we are climbing a likelihood (ascent), not minimizing a loss.</p>`,

    derivation:
      `<p><b>Where each piece comes from.</b></p>
       <ul class="steps">
         <li><b>The $\\log\\lvert W\\rvert$ term is the change-of-variables Jacobian.</b> If
          $s = Wx$ and $s$ has density $p_s$, then the rule for transforming a density says
          $p_x(x) = p_s(Wx)\\,\\lvert\\det W\\rvert$. The determinant measures how much the linear
          map $W$ scales volumes (see <code>la-determinant</code>); probability density must rescale by
          exactly that factor so it still integrates to 1. Taking logs turns $\\lvert\\det W\\rvert$
          into the additive $\\log\\lvert W\\rvert$ term. This is the same one-dimensional fact
          $p_x(x) = p_s(s)\\lvert ds/dx\\rvert$ generalized to $n$ dimensions (see
          <code>probx-derived</code>).</li>
         <li><b>Why a non-Gaussian source prior.</b> ICA can only separate sources that are
          <b>non-Gaussian</b> &mdash; a rotation of independent Gaussians is still independent
          Gaussians, so the problem is unidentifiable for Gaussian sources (the <code>ml-ica</code>
          pitfall). Choosing the sigmoid as the source CDF makes $p_s = g'$ a peaky, heavy-tailed
          (<b>super-Gaussian</b>) density. That non-Gaussianity is what lets the likelihood prefer the
          true unmixing over every rotated impostor.</li>
         <li><b>Differentiating the log-likelihood.</b> The derivative of $\\log\\lvert W\\rvert$ with
          respect to $W$ is $(W^{\\top})^{-1}$ (a standard matrix-calculus identity). The derivative of
          $\\log g'(w_j^{\\top}x)$ works out to $(1 - 2g(w_j^{\\top}x))\\,x^{\\top}$ for row $j$
          (using $g' = g(1-g)$, so $\\frac{d}{dz}\\log g'(z) = 1 - 2g(z)$). Stacking the rows gives the
          column vector times $x^{(i)\\top}$ in the update.</li>
         <li><b>The $(W^{\\top})^{-1}$ term keeps $W$ invertible.</b> As $W$ heads toward singular
          ($\\det W \\to 0$), $\\log\\lvert W\\rvert \\to -\\infty$, crushing the likelihood. Its
          gradient $(W^{\\top})^{-1}$ blows up and shoves $W$ away from singularity &mdash; it is the
          force that keeps $W$ a genuine, invertible unmixing matrix. The popular <b>natural-gradient</b>
          variant multiplies the whole gradient by $W^{\\top}W$ on the right, which cancels this matrix
          inverse and replaces $(W^{\\top})^{-1}$ with a much cheaper, better-conditioned update
          $\\left(I + (1-2g)(Wx)^{\\top}\\right)W$. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>One stochastic-ascent step on a single data point, by hand, in 2-D. Start from
       $W = \\begin{bmatrix}1 & 0\\\\ 0 & 1\\end{bmatrix}$ (the identity), learning rate $\\alpha = 0.1$,
       on the recording $x^{(i)} = \\begin{bmatrix}1\\\\ 2\\end{bmatrix}$.</p>
       <ul class="steps">
         <li><b>Recovered values.</b> $Wx = \\begin{bmatrix}1\\\\ 2\\end{bmatrix}$.</li>
         <li><b>Sigmoid.</b> $g(1) = 0.731$, $g(2) = 0.881$, so
          $1 - 2g = \\begin{bmatrix}-0.462\\\\ -0.762\\end{bmatrix}$.</li>
         <li><b>Outer product</b> $(1-2g)\\,x^{\\top} = \\begin{bmatrix}-0.462 & -0.924\\\\ -0.762 & -1.523\\end{bmatrix}$.</li>
         <li><b>Jacobian term.</b> $(W^{\\top})^{-1} = \\begin{bmatrix}1 & 0\\\\ 0 & 1\\end{bmatrix}$ (identity is its own inverse).</li>
         <li><b>Gradient</b> = sum of the two $= \\begin{bmatrix}0.538 & -0.924\\\\ -0.762 & 0.477\\end{bmatrix}$.</li>
         <li><b>Update.</b> $W \\leftarrow W + 0.1\\cdot\\text{grad} = \\begin{bmatrix}1.054 & -0.092\\\\ -0.076 & 0.948\\end{bmatrix}$.</li>
       </ul>
       <p>$W$ moved off the identity. Repeating this over the whole data set drives it toward
       $A^{-1}$ (up to scale and permutation).</p>`,

    whenToUse:
      `<p><b>Reach for the Bell-Sejnowski / infomax update when you need to actually fit ICA from
       scratch</b> &mdash; you understand the cocktail-party setup (<code>ml-ica</code>) and now want
       the learning rule that produces $W$.</p>
       <ul>
         <li><b>Use the natural-gradient variant</b> in practice: same fixed point, but it drops the
          $(W^{\\top})^{-1}$ matrix inverse for a cheaper, far more stable update &mdash; the default in
          most "infomax ICA" implementations (MNE-Python's <code>infomax</code>, EEGLAB's runica).</li>
         <li><b>Choose infomax over FastICA</b> when your sources are <b>super-Gaussian</b> (peaky,
          heavy-tailed &mdash; like EEG, audio), which the sigmoid prior matches; FastICA is faster but
          its default contrast assumes a different shape.</li>
       </ul>
       <p><b>Pick a different tool when</b> sources are Gaussian (unrecoverable by any ICA), the mixing
       is nonlinear (linear ICA fails), or you just want compression &mdash; use PCA. For everyday use,
       call <code>sklearn.decomposition.FastICA</code> or MNE's infomax rather than hand-rolling this.</p>`,

    application:
      `<p>The infomax update is the workhorse behind production ICA.</p>
       <ul>
         <li><b>EEG / MEG artifact removal.</b> EEGLAB's <code>runica</code> and MNE-Python's
          <code>infomax</code> are this exact algorithm (natural-gradient form). They split brain
          recordings into independent components so eye-blink and heartbeat artifacts can be removed.</li>
         <li><b>Audio source separation.</b> Unmixing blended microphone channels into separate
          voices/instruments &mdash; the literal cocktail-party problem.</li>
         <li><b>Why "infomax".</b> Bell &amp; Sejnowski (1995) derived the identical update by
          <i>maximizing the information</i> (entropy) at the output of sigmoid nonlinearities. The
          maximum-likelihood view here and the infomax view give the same rule &mdash; a tidy
          equivalence.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Plain gradient is slow and can wander.</b> The raw $(W^{\\top})^{-1}$ update is
          ill-conditioned. The fix is the <b>natural gradient</b> (multiply by $W^{\\top}W$), which is
          why every real implementation uses it &mdash; same answer, much faster and steadier.</li>
         <li><b>Gaussian sources are unrecoverable.</b> The whole method rests on a non-Gaussian source
          prior. If the true sources are Gaussian, no learning rate fixes it &mdash; the likelihood is
          flat under rotation. (Same root cause as the <code>ml-ica</code> pitfall.)</li>
         <li><b>Center (and ideally whiten) first.</b> The derivation assumes zero-mean data. Subtract
          the mean of each channel; whitening (decorrelate to unit variance) makes the ascent converge
          much faster.</li>
         <li><b>Sigmoid prior assumes super-Gaussian sources.</b> $g' $ is peaky and heavy-tailed, a good
          fit for EEG/audio but wrong for <b>sub-Gaussian</b> (flat-topped) sources, where it can fail to
          separate. Use a different nonlinearity (e.g. the "extended infomax" cube term) for those.</li>
         <li><b>Scale, sign, and permutation are ambiguous.</b> $W$ converges to $A^{-1}$ only up to row
          scaling and reordering &mdash; $WA$ is a scaled permutation, not the identity. Never trust the
          amplitude or index of a recovered component without anchoring.</li>
         <li><b>Use ascent, not descent.</b> We are <i>maximizing</i> a likelihood, so the update
          <i>adds</i> $\\alpha\\,\\nabla\\ell$. Flipping the sign sends $W$ toward singular and the
          likelihood to $-\\infty$.</li>
       </ul>`,

    practice: [
      {
        q: `Why does the term $\\log\\lvert W\\rvert$ appear in the log-likelihood $\\ell(W)$? What would go wrong if you dropped it?`,
        steps: [
          { do: `Recall we model the sources $s = Wx$ with a density $p_s$, but we observe $x$, not $s$.`, why: `The likelihood must be the probability of the observed $x$, so we need the density of $x$, not of $s$.` },
          { do: `Apply the change-of-variables rule: $p_x(x) = p_s(Wx)\\lvert\\det W\\rvert$.`, why: `A linear map $W$ rescales volumes by $\\lvert\\det W\\rvert$, so density must rescale by the same factor to stay a valid probability density (see la-determinant).` },
          { do: `Take the log: the determinant factor becomes the additive $\\log\\lvert W\\rvert$.`, why: `Logs turn the product into a sum, giving the term in $\\ell(W)$.` }
        ],
        answer: `<p>It is the <b>change-of-variables Jacobian</b>. We model the sources but observe the mixtures, so the density of $x$ picks up a factor $\\lvert\\det W\\rvert$ that accounts for how $W$ rescales volume; its log is $\\log\\lvert W\\rvert$. <b>Drop it</b> and the likelihood no longer penalizes $W$ shrinking toward singular &mdash; gradient ascent would happily drive $\\det W \\to 0$, collapsing all recovered sources onto one direction instead of unmixing them.</p>`
      },
      {
        q: `In the update, what is the role of the $(W^{\\top})^{-1}$ term, and what does the natural-gradient variant do with it?`,
        steps: [
          { do: `Identify $(W^{\\top})^{-1}$ as the gradient of the $\\log\\lvert W\\rvert$ term.`, why: `The matrix-calculus identity $\\nabla_W \\log\\lvert W\\rvert = (W^{\\top})^{-1}$.` },
          { do: `See that as $\\det W \\to 0$ this term blows up.`, why: `It pushes $W$ away from singular, keeping it invertible &mdash; a real unmixing matrix.` },
          { do: `Recall the natural gradient multiplies the whole gradient by $W^{\\top}W$.`, why: `That cancels the matrix inverse, giving the cheaper, better-conditioned update $(I + (1-2g)(Wx)^{\\top})W$.` }
        ],
        answer: `<p>$(W^{\\top})^{-1}$ is the gradient of $\\log\\lvert W\\rvert$; it <b>keeps $W$ invertible</b> by pushing it away from singular matrices (where the likelihood is $-\\infty$). The <b>natural-gradient</b> variant multiplies the gradient by $W^{\\top}W$, which cancels the inverse and replaces it with the cheaper, more stable update used in real infomax ICA.</p>`
      },
      {
        q: `You run the update and $W$ converges, but $WA$ comes out as $\\begin{bmatrix}0 & 1.9\\\\ 2.0 & 0\\end{bmatrix}$ instead of the identity. Did ICA fail?`,
        steps: [
          { do: `Check whether $WA$ is a scaled permutation matrix (one nonzero per row/column).`, why: `If so, the recovered sources are the true sources reordered and rescaled.` },
          { do: `Recognize that ICA is only identifiable up to scale, sign, and permutation.`, why: `Independence is preserved under reordering and rescaling, so the likelihood cannot prefer one labeling/scale over another.` },
          { do: `Match each recovered source to a true one (by absolute correlation) before judging.`, why: `Anchoring resolves the permutation/sign so you can compare.` }
        ],
        answer: `<p><b>No, it succeeded.</b> $WA$ is a <b>scaled permutation</b> (zeros on the diagonal, nonzeros off it), meaning recovered source 1 is true source 2 rescaled, and vice versa. ICA recovers sources only up to <b>scale, sign, and order</b>, so a clean permutation is a perfect result &mdash; just re-pair and rescale the components.</p>`
      }
    ]
  });

  window.CODE["mlx-ica-infomax"] = {
    lib: "NumPy",
    runnable: false,
    explain: `<p>The Bell-Sejnowski update from scratch. We generate two independent <b>non-Gaussian</b>
      (Laplace &mdash; peaky, heavy-tailed, matching the sigmoid prior) sources, mix them with a known
      $A$, center the mixtures, then run <b>stochastic gradient ascent</b> with the exact update
      $W \\leftarrow W + \\alpha\\big((1-2g(Wx))x^{\\top} + (W^{\\top})^{-1}\\big)$. We print the
      recovered $W$, confirm $WA$ is a scaled permutation (so $W\\approx A^{-1}$ up to scale/order), and
      report the absolute correlation of each recovered source with the originals (near 1). Runs in
      Colab; uses only NumPy.</p>`,
    code: `import numpy as np
np.random.seed(0)

# --- 1. two independent NON-Gaussian sources (Laplace: peaky, heavy-tailed) ---
m = 4000
S = np.vstack([np.random.laplace(0, 1, m),
               np.random.laplace(0, 1, m)])          # 2 x m true sources
S = S / S.std(axis=1, keepdims=True)                 # unit scale

# --- 2. mix with a KNOWN A, then center (algorithm assumes zero mean) ---
A = np.array([[1.0, 0.7],
              [0.4, 1.0]])
X = A @ S
X = X - X.mean(axis=1, keepdims=True)                # 2 x m observed mixtures

def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))

# --- 3. Bell-Sejnowski stochastic gradient ASCENT on the log-likelihood ---
W = np.eye(2)                                        # start from the identity
for epoch in range(40):
    alpha = 0.01 / (1.0 + 0.05 * epoch)              # gently anneal the step size
    for i in np.random.permutation(m):
        x = X[:, i:i+1]                              # one recording, 2 x 1
        g = sigmoid(W @ x)                           # 2 x 1
        grad = (1 - 2 * g) @ x.T + np.linalg.inv(W.T)   # the update's gradient
        W = W + alpha * grad                         # ASCENT: add the gradient

# --- 4. did we recover A^-1 (up to scale / permutation)? ---
print("recovered W =\\n", np.round(W, 3))
print("W @ A (should be a scaled permutation) =\\n", np.round(W @ A, 3))

R = W @ X                                            # recovered sources
def abscorr(a, b):
    a, b = a - a.mean(), b - b.mean()
    return abs((a * b).sum() / np.sqrt((a*a).sum() * (b*b).sum()))

print("\\n|corr| of each recovered source with the true sources:")
for r in range(2):
    cs = [abscorr(R[r], S[j]) for j in range(2)]
    print(f"  recovered {r}: max |corr| = {max(cs):.3f} (-> true source {int(np.argmax(cs))})")
# recovered W =
#  [[ 2.649 -1.869]
#   [-1.058  2.728]]
# W @ A (should be a scaled permutation) =
#  [[ 1.901 -0.015]
#   [ 0.033  1.988]]      # off-diagonals ~0  ->  W = A^-1 up to scale/order
# |corr| of each recovered source with the true sources:
#   recovered 0: max |corr| = 1.000 (-> true source 0)
#   recovered 1: max |corr| = 1.000 (-> true source 1)`
  };

  window.CODEVIZ["mlx-ica-infomax"] = {
    question: "After running Bell-Sejnowski ICA, how well does each recovered source match its true source, compared with the raw mixed signals it started from?",
    charts: [
      {
        type: "bars",
        title: "Absolute correlation with the true sources: recovered (after ICA) vs mixed (before)",
        xlabel: "signal",
        ylabel: "|correlation| with best-matching true source",
        labels: ["recovered\\nsource 1", "recovered\\nsource 2", "mixed\\nmic 1", "mixed\\nmic 2"],
        values: [1.000, 1.000, 0.818, 0.928],
        valueLabels: ["1.000", "1.000", "0.818", "0.928"],
        colors: ["#7ee787", "#7ee787", "#ffb454", "#ffb454"]
      }
    ],
    caption: "Real numbers (seed 0): two Laplace sources mixed by A = [[1,0.7],[0.4,1]], then unmixed by the Bell-Sejnowski update over 40 epochs. Each MIXED mic correlates only 0.818 / 0.928 with a true source (it is a blend of both). After ICA, each RECOVERED source correlates 1.000 with its true source &mdash; the unmixing worked. (The match is up to scale/sign/order: W @ A came out [[1.901,-0.015],[0.033,1.988]], a clean scaled permutation, so W = A^-1 up to scale and reordering.)",
    code: `import numpy as np
np.random.seed(0)

m = 4000
S = np.vstack([np.random.laplace(0,1,m), np.random.laplace(0,1,m)])
S = S / S.std(axis=1, keepdims=True)
A = np.array([[1.0,0.7],[0.4,1.0]])
X = A @ S; X = X - X.mean(axis=1, keepdims=True)

sig = lambda z: 1.0/(1.0+np.exp(-z))
W = np.eye(2)
for epoch in range(40):
    alpha = 0.01/(1.0 + 0.05*epoch)
    for i in np.random.permutation(m):
        x = X[:, i:i+1]; g = sig(W @ x)
        W = W + alpha*((1-2*g) @ x.T + np.linalg.inv(W.T))

R = W @ X
def c(a, b):
    a, b = a-a.mean(), b-b.mean()
    return abs((a*b).sum()/np.sqrt((a*a).sum()*(b*b).sum()))

rec = [max(c(R[r], S[0]), c(R[r], S[1])) for r in range(2)]   # after ICA
mix = [max(c(X[r], S[0]), c(X[r], S[1])) for r in range(2)]   # before (raw mics)
print("recovered |corr|:", [round(v,3) for v in rec])  # -> [1.0, 1.0]
print("mixed     |corr|:", [round(v,3) for v in mix])  # -> [0.818, 0.928]`
  };
})();
