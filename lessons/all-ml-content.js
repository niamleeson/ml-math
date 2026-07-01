/* Authored lesson content for the All ML renderer, keyed by topic id.
   Each value is HTML rendered into a section card; MathJax typesets $...$ and $$...$$.
   Use String.raw`...` so LaTeX backslashes (\frac, \sqrt, \top) survive intact.
   Topics with no entry here fall back to the five-section scaffold automatically. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["8.11"] = {
  tagline: "Let every token look at every other token: a weighted average of values, where the weights come from query\u2013key similarity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/8.11-attention.ipynb",

  context: String.raw`
    <p>You already hold every piece of this lesson; attention just gives each one a new job.</p>
    <ul>
      <li><b>Word embeddings</b> gave each token a <i>static</i> meaning. Attention turns that into a
        <i>context-dependent</i> meaning by asking which words matter to each other in <i>this</i> sentence.</li>
      <li><b>The dot product</b> you learned as a measure of alignment <i>is</i> the scoring step here — nothing more exotic.</li>
      <li><b>Softmax</b>, which turned class scores into probabilities, does the identical job over <i>positions</i>.</li>
      <li><b>MLPs and backprop</b> train attention's projection matrices with the same gradient descent you already trust.</li>
    </ul>
    <p><b>Where it leads:</b> wrap this single layer with residuals, LayerNorm and a feed-forward net to get a
      <i>Transformer block</i> (8.12); stack blocks with a causal mask for <i>GPT</i> (9.2); drop the mask for <i>BERT</i> (9.1);
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
      <i>ask</i> a different question than it <i>answers</i>. Separate learned projections let similarity be <i>directed and asymmetric</i>
      — the only way attention can represent "this word points at that word."</p>`,

  mathematics: String.raw`
    <p>The whole operation, for the sequence at once:</p>
    <div class="formula-box">$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$</div>
    <p>With tokens $X\in\mathbb{R}^{T\times d}$: $Q=XW_q$, $K=XW_k$ (each $T\times d_k$) and $V=XW_v$ ($T\times d_v$).
      Then $QK^\top$ is the $T\times T$ score table, softmax runs along each row, and $\times V$ blends the Values.
      Every number below is executed in the companion notebook; the examples walk the formula's moving parts from a single
      number to a full pass.</p>

    <p><b>Scoring — the dot product.</b> <b>(1)</b> each score is one dot product against a Query $a=[2,1]$:</p>
    <table class="mini">
      <tr><th>Key</th><th>$a\cdot k$</th><th>meaning</th></tr>
      <tr><td>$[2,1]$ aligned</td><td>$5$</td><td>attend hard</td></tr>
      <tr><td>$[-1,2]$ orthogonal</td><td>$0$</td><td>ignore</td></tr>
      <tr><td>$[-2,-1]$ opposite</td><td>$-5$</td><td>pushed away</td></tr>
    </table>
    <p><b>(2)</b> magnitude scales it: $a\cdot[3,4]=10$ but $(2a)\cdot[3,4]=20$. <b>(3)</b> cosine removes magnitude:
      $[1,0]\cdot[1,0]=1$ and $[1,0]\cdot[10,0]=10$, yet both have cosine $1.00$. <b>(4)</b> the score is <i>directed</i>:
      with the matrix below $\text{score}(0\!\to\!1)=1$ while $\text{score}(1\!\to\!0)=0$ — that asymmetry is why $Q$ and $K$ are separate.</p>

    <p><b>Building $QK^\top$.</b> <b>(5)</b> three tokens give the full $3\times3$ table:</p>
    <div class="formula-box">$$QK^\top=\begin{bmatrix}1&1&0\\0&1&1\\1&2&1\end{bmatrix}$$</div>
    <p><b>(6)</b> row $0$ is who token 0 attends to; column $0$ is who attends <i>to</i> token 0 — different vectors.</p>

    <p><b>Scaling by $\sqrt{d_k}$.</b> <b>(7)</b> the measured spread of $q\cdot k$ tracks $\sqrt{d_k}$ almost exactly:</p>
    <table class="mini">
      <tr><th>$d_k$</th><th>$4$</th><th>$64$</th><th>$512$</th></tr>
      <tr><td>measured std of $q\cdot k$</td><td>$2.0$</td><td>$8.0$</td><td>$22.9$</td></tr>
      <tr><td>$\sqrt{d_k}$</td><td>$2.0$</td><td>$8.0$</td><td>$22.6$</td></tr>
    </table>
    <p><b>(8)</b> unscaled large scores $[16,8,0]$ softmax to $[1,0,0]$ — saturated, gradient near zero. <b>(9)</b> the same
      scores $\div 8$ give $[0.665,0.245,0.090]$ — soft and still learnable. That is the entire reason for the $\sqrt{d_k}$.</p>

    <p><b>Softmax.</b> <b>(10)</b> $\text{softmax}([2,1,0])=[0.665,0.245,0.090]$. <b>(11)</b> it is shift-invariant:
      $[102,101,100]$ gives the <i>identical</i> weights (why we subtract the row max for stability). <b>(12)</b> it sharpens —
      a gap of $3.0$ in $[4,1]$ becomes $[0.953,0.047]$, a $20\times$ ratio. <b>(13)</b> temperature controls the peak:
      $\div 0.5\to[0.867,0.117,0.016]$ (peaky), $\div 2\to[0.506,0.307,0.186]$ (flat). <b>(14)</b> a tie $[1,1]\to[0.5,0.5]$;
      a small gap $[0.707,0]\to[0.67,0.33]$.</p>

    <p><b>The weighted average $(\times V)$.</b> <b>(15)</b> the realistic end-to-end: "it" with scaled scores $[4.0,1.0,2.5]$
      softmaxes to $[0.786,0.039,0.175]$; with Values $V=\{[0,0],[4,0],[2,3]\}$ the output is $[0.507,0.526]$ — overwhelmingly the
      "animal" Value. <b>(16)</b> the weights are $\ge 0$ and sum to $1$, so the output is a convex combination — provably inside the
      Values' hull, it can never overshoot. <b>(17)</b> push the weights near one-hot $[0.01,0.98,0.01]$ and the output $[3.94,0.03]$
      snaps onto a single Value $V_1=[4,0]$ — the hard-lookup limit.</p>

    <p><b>Multi-head.</b> <b>(18)</b> with $d_\text{model}=512$ and $h=8$ heads, each head works in $d_k=512/8=64$ dimensions and the
      eight $64$-wide outputs concatenate back to $8\times64=512$ — so running eight heads costs about the same as one, buying
      parallelism of meaning almost for free.</p>

    <p><b>Masking.</b> <b>(19)</b> a causal mask adds $-\infty$ above the diagonal <i>before</i> softmax, so the upper triangle is
      exactly $0$ and every row still sums to $1$:</p>
    <div class="formula-box">$$\begin{bmatrix}1&0&0&0\\0.96&0.04&0&0\\0.21&0.12&0.67&0\\0.15&0.14&0.64&0.07\end{bmatrix}$$</div>
    <p><b>(20)</b> a padding mask on the last (pad) key sends its weight to $0$ and renormalizes the rest:
      $[0.085,0.232,0.052,0.631]\to[0.231,0.629,0.140,0]$, still summing to $1$.</p>`,

  code: String.raw`
    <p><i>Everything above, runnable and verified.</i> The companion Colab notebook rebuilds all twenty examples from scratch in
      numpy, cross-checks the full layer against <code>F.scaled_dot_product_attention</code>, and renders nine static
      visualizations — the angle-swept dot product, the attention-flow diagram (opacity = weight), the convex-hull blend,
      per-head heatmaps, and the autoregressive mask "unlock". It is run-all safe and self-verifying: every cell ends in an
      <code>assert</code>. Open it with the <b>Open in Colab</b> button at the top of this lesson.</p>`,

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
