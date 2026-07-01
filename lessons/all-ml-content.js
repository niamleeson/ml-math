/* Authored lesson content for the All ML renderer, keyed by topic id.
   Each value is HTML rendered into a section card; MathJax typesets $...$ and $$...$$.
   Use String.raw`...` so LaTeX backslashes (\frac, \sqrt, \top) survive intact.
   Topics with no entry here fall back to the four-section scaffold automatically. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["8.11"] = {
  tagline: "Let every token look at every other token: a weighted average of values, where the weights come from query\u2013key similarity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.11-attention.ipynb",

  context: String.raw`
    <p>You already hold every piece of this lesson; attention just gives each one a new job.</p>
    <ul>
      <li><b>Word embeddings</b> gave each token a static meaning. Attention turns that into a
        context-dependent meaning by asking which words matter to each other in this sentence.</li>
      <li><b>The dot product</b> you learned as a measure of alignment is the scoring step here — nothing more exotic.</li>
      <li><b>Softmax</b>, which turned class scores into probabilities, does the identical job over positions.</li>
      <li><b>MLPs and backprop</b> train attention's projection matrices with the same gradient descent you already trust.</li>
    </ul>
    <p><b>Where it leads:</b> wrap this single layer with residuals, LayerNorm and a feed-forward net to get a
      Transformer block (8.12); stack blocks with a causal mask for GPT (9.2); drop the mask for BERT (9.1);
      and its $O(T^2)$ cost is exactly what efficient/long-context attention (8.14) exists to tame.</p>`,

  intuition: String.raw`
    <p>The models before attention — RNNs — read left to right, one step at a time, computing
      $h_t = f(h_{t-1}, x_t)$. That traps them two ways: you cannot parallelize across time, and for word 1 to
      influence word 10 its signal must survive nine transformations, so long-range links fade (vanishing gradients).</p>
    <p>Attention throws out the finger-under-each-word rule and lets <b>every word look directly at every other word at once</b>.
      Think of a <b>soft dictionary lookup</b>: each token emits a <b>Query</b> (what I want), a <b>Key</b> (what I advertise),
      and a <b>Value</b> (what I hand over). Compare a Query to every Key, softmax the scores into weights that sum to one,
      then take that weighted blend of Values.</p>
    <p><b>The design decision people gloss over:</b> why three separate vectors, not the raw embedding for all? Because a word must
      ask a different question than it answers. Separate learned projections let similarity be directed and asymmetric
      — the only way attention can represent "this word points at that word."</p>`,

  mathematics: String.raw`
    <p>The whole operation, for the sequence at once:</p>
    <div class="formula-box">$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$</div>
    <p>With tokens $X\in\mathbb{R}^{T\times d}$: $Q=XW_q$, $K=XW_k$ (each $T\times d_k$) and $V=XW_v$ ($T\times d_v$).
      Then $QK^\top$ is the $T\times T$ score table, softmax runs along each row, and $\times V$ blends the Values.
      Below, every number is computed in view; each block is executed in the companion notebook.</p>

    <p><b>Scoring — the dot product.</b> A score is one dot product. With a Query $a=[2,1]$:</p>
    <ol class="work">
      <li>aligned $[2,1]$: $\;2\cdot2+1\cdot1=5$</li>
      <li>orthogonal $[-1,2]$: $\;2\cdot(-1)+1\cdot2=0$</li>
      <li>opposite $[-2,-1]$: $\;2\cdot(-2)+1\cdot(-1)=-5$</li>
    </ol>
    <p>The score is largest when the two vectors point the same way, exactly zero when they are perpendicular, and negative when
      they oppose — so the dot product is literally measuring alignment, and that single number is how a token decides how much
      it cares about another. Magnitude counts too, not just direction: $a\cdot[3,4]=2\cdot3+1\cdot4=10$, and doubling the Query
      doubles the score, $(2a)\cdot[3,4]=20$. If you want direction alone, cosine divides that out —
      $\cos=\frac{a\cdot k}{\lVert a\rVert\,\lVert k\rVert}$, so $[1,0]$ against $[1,0]$ and against $[10,0]$ both give $\cos=1.00$
      even though the raw dots are $1$ and $10$. And crucially the score is directed: below $\text{score}(0\!\to\!1)=1$ while
      $\text{score}(1\!\to\!0)=0$, and it is precisely this asymmetry — "0 attends to 1" need not equal "1 attends to 0" — that
      forces $Q$ and $K$ to be separate matrices rather than one shared vector.</p>

    <p><b>Building $QK^\top$.</b> Entry $(i,j)$ is $Q_i\cdot K_j$. Take row 0, with $Q_0=[1,0]$ against $K_0=[1,0]$, $K_1=[1,1]$, $K_2=[0,1]$:</p>
    <ol class="work">
      <li>$Q_0\cdot K_0 = 1\cdot1+0\cdot0 = 1$</li>
      <li>$Q_0\cdot K_1 = 1\cdot1+0\cdot1 = 1$</li>
      <li>$Q_0\cdot K_2 = 1\cdot0+0\cdot1 = 0$</li>
    </ol>
    <p>Repeating for the other two tokens fills the whole table:</p>
    <div class="formula-box">$$QK^\top=\begin{bmatrix}1&1&0\\0&1&1\\1&2&1\end{bmatrix}$$</div>
    <p>Reading it by axis is the key skill: row $i$ tells you who token $i$ attends to, while column $j$ tells you
      who attends to token $j$ — and since the matrix is not symmetric, those are genuinely different vectors, the concrete
      payoff of the directed scoring above.</p>

    <p><b>Scaling by $\sqrt{d_k}$.</b> Why divide the scores at all? Each component of $Q,K$ has variance $1$, and
      $q\cdot k=\sum_{i=1}^{d_k} q_i k_i$ sums $d_k$ independent terms of variance $1$, so $\text{Var}(q\cdot k)=d_k$ and the typical
      score magnitude grows like $\sqrt{d_k}$. Measured over random vectors, the spread matches that prediction almost exactly:</p>
    <table class="mini">
      <tr><th>$d_k$</th><th>$4$</th><th>$64$</th><th>$512$</th></tr>
      <tr><td>measured std of $q\cdot k$</td><td>$2.0$</td><td>$8.0$</td><td>$22.9$</td></tr>
      <tr><td>$\sqrt{d_k}$</td><td>$2.0$</td><td>$8.0$</td><td>$22.6$</td></tr>
    </table>
    <p>That growth is a problem because large scores saturate softmax. Feed the unscaled $[16,8,0]$ through it:</p>
    <ol class="work">
      <li>exponentiate: $e^{16}=8{,}886{,}111,\; e^{8}=2{,}981,\; e^{0}=1$</li>
      <li>the top term alone is $e^{8}\approx 2981\times$ larger than the next</li>
      <li>weights $\Rightarrow [\,1.000,\; 0.000,\; 0.000\,]$</li>
    </ol>
    <p>The distribution has collapsed onto a single position — a spike where softmax's gradient is essentially $0$, so the model
      can no longer learn from it. Dividing by $\sqrt{d_k}$ (here $[16,8,0]\div 8=[2,1,0]$) pulls the scores back to a range where
      softmax stays soft and gradients keep flowing; that is the entire reason the $\sqrt{d_k}$ is in the formula.</p>

    <p><b>Softmax.</b> This is what turns raw scores into weights. Walk $\text{softmax}([2,1,0])$ one operation at a time:</p>
    <ol class="work">
      <li>exponentiate: $e^{2}=7.389,\; e^{1}=2.718,\; e^{0}=1.000$</li>
      <li>sum: $7.389+2.718+1.000=11.107$</li>
      <li>divide: $\tfrac{7.389}{11.107}=0.665,\;\; \tfrac{2.718}{11.107}=0.245,\;\; \tfrac{1.000}{11.107}=0.090$</li>
    </ol>
    <p>A logit gap of just $1.0$ has already become a $0.665$ vs $0.245$ share — a $2.7\times$ preference — and because the three
      weights are positive and sum to $1$, they form a genuine distribution over positions, which is exactly what we need to average
      Values. Two properties fall straight out of that arithmetic. Softmax is <b>shift-invariant</b>: adding $100$ to every score,
      $[102,101,100]$, cancels in the ratio ($e^{102}/e^{101}=e$, just as $e^{2}/e^{1}=e$) and returns the identical
      $[0.665,0.245,0.090]$ — which is why we subtract the row max before exponentiating, to avoid overflow with no change to the
      result. And it <b>sharpens</b>: for $[4,1]$, $e^{4}=54.598$, $e^{1}=2.718$, sum $57.316$, giving $[0.953,0.047]$, so a gap of
      $3$ became a $20\times$ ratio — the exponential turns modest score differences into confident choices. Temperature tunes how
      sharp: dividing the scores by $0.5$ concentrates them to $[0.867,0.117,0.016]$, dividing by $2$ flattens them to
      $[0.506,0.307,0.186]$.</p>

    <p><b>The weighted average $(\times V)$.</b> Now the full "it" example, end to end. Scaled scores $[4.0,1.0,2.5]$ against
      Values $V_0=[0,0]$, $V_1=[4,0]$ ("animal"), $V_2=[2,3]$:</p>
    <ol class="work">
      <li>softmax: $e^{4}=54.598,\; e^{1}=2.718,\; e^{2.5}=12.182$; sum $69.499$; weights $[0.786,\,0.039,\,0.175]$</li>
      <li>$x = 0.786\cdot0 + 0.039\cdot4 + 0.175\cdot2 = 0.156+0.350 = 0.506$</li>
      <li>$y = 0.786\cdot0 + 0.039\cdot0 + 0.175\cdot3 = 0.525$</li>
      <li>output $=[\,0.506,\; 0.525\,]$</li>
    </ol>
    <p>The output lands almost exactly on $V_1=[4,0]$, the "animal" Value — so the pronoun "it" has resolved to "animal" purely by
      weighted averaging, with no hand-written rule. And because the weights are $\ge 0$ and sum to $1$, the output is a
      convex combination of the Values: it can never leave the triangle they span, so attention can blend and interpolate but
      never overshoot. Push the weights near one-hot, $[0.01,0.98,0.01]$, and the output $0.98\cdot[4,0]=[3.94,0.03]$ snaps onto a
      single Value — the hard-lookup limit, where soft attention degenerates into an ordinary dictionary lookup.</p>

    <p><b>Multi-head.</b> One head produces one distribution per token, so it can only track one kind of relation at a time. The fix
      is to run several in parallel: with $d_\text{model}=512$ and $h=8$ heads, each head works in $d_k=512/8=64$ dimensions, and the
      eight $64$-wide outputs concatenate back to $8\times64=512$. Since each head is $1/8$ the width, eight of them cost about the
      same as one full-width attention — so the model gets eight different relations (syntax, coreference, position, …) almost for free.</p>

    <p><b>Masking.</b> To stop a token from seeing the future, add $-\infty$ to those scores before softmax. Token at
      position 1, with scores $[2,1]$ for positions $0,1$ and $-\infty$ for $2,3$:</p>
    <ol class="work">
      <li>exponentiate: $e^{2}=7.389,\; e^{1}=2.718,\; e^{-\infty}=0,\; e^{-\infty}=0$</li>
      <li>sum: $7.389+2.718=10.107$</li>
      <li>weights $=[\,0.731,\; 0.269,\; 0,\; 0\,]$</li>
    </ol>
    <p>The future positions receive exactly zero weight — because $e^{-\infty}=0$ — while the surviving weights still sum to
      $1$. That is why the mask goes in before softmax: softmax renormalizes over only the allowed positions, whereas zeroing
      weights after softmax would leave the row summing to less than $1$ and quietly break the average. The same trick handles
      padding: real scores $[1,2,0.5]$ with a $\langle\text{pad}\rangle$ key at the end ($-\infty$) give $e^{1}=2.718$, $e^{2}=7.389$,
      $e^{0.5}=1.649$, sum $11.756$, so $[0.231,0.629,0.140,0]$ — the pad contributes nothing and the rest renormalize. Every figure
      and cross-check for all of the above lives in the notebook: the <b>Open in Colab</b> button at the top of this lesson.</p>`,

  pitfalls: String.raw`
    <ul>
      <li><b>Forgot the causal mask.</b> Training loss looks suspiciously great because the model reads future tokens;
        generation then produces nonsense. The #1 GPT bug — the tell is a train loss that is "too good."</li>
      <li><b>Forgot the $\sqrt{d_k}$ scaling.</b> Scores get variance $d_k$, softmax saturates into a near one-hot spike,
        gradients collapse, training stalls. The larger $d_k$, the worse it bites.</li>
      <li><b>No positional encoding.</b> The formula is order-agnostic — "dog bites man" equals "man bites dog" until you inject position.</li>
      <li><b>The $T\times T$ matrix explodes.</b> Memory grows with the square of sequence length; doubling context quadruples cost.</li>
      <li><b>Unmasked padding.</b> The model attends to $\langle\text{pad}\rangle$ tokens and learns noise — mask them with $-\infty$ too.</li>
    </ul>`
};
