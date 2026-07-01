/* Authored lesson content for the All ML renderer, keyed by topic id.
   Each value is HTML rendered into a section card; MathJax typesets $...$ and $$...$$.
   Use String.raw`...` so LaTeX backslashes (\frac, \sqrt, \top) survive intact.
   Topics with no entry here fall back to the five-section scaffold automatically. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["8.11"] = {
  tagline: "Let every token look at every other token: a weighted average of values, where the weights come from query–key similarity.",

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
    <p>With tokens $X\in\mathbb{R}^{T\times d}$, projections give $Q=XW_q$, $K=XW_k$ (both $T\times d_k$) and $V=XW_v$.
      Then $QK^\top$ is the $T\times T$ table of "how much token $i$ cares about token $j$," softmax runs along each row,
      and multiplying by $V$ replaces each token with a weighted blend of Values.</p>

    <p><b>Example 1 — the score is just a similarity.</b> One Query $a=[2,1]$ against three Keys:</p>
    <table class="mini">
      <tr><th>Key</th><th>$a\cdot\text{Key}$</th><th>meaning</th></tr>
      <tr><td>[2, 1]</td><td>5</td><td>aligned — attend hard</td></tr>
      <tr><td>[-1, 2]</td><td>0</td><td>orthogonal — ignore</td></tr>
      <tr><td>[-2, -1]</td><td>-5</td><td>opposite — pushed away</td></tr>
    </table>

    <p><b>Example 2 — softmax turns scores into a blend.</b> Computing the output for "it," with scaled scores
      animal $=4.0$, street $=1.0$, tired $=2.5$: exponentiate ($54.598,\,2.718,\,12.182$; sum $69.499$) and divide:</p>
    <table class="mini">
      <tr><th>attends to</th><th>weight</th></tr>
      <tr><td>animal</td><td>0.786</td></tr>
      <tr><td>street</td><td>0.039</td></tr>
      <tr><td>tired</td><td>0.175</td></tr>
    </table>
    <p>The output is $0.786\,V_{\text{animal}}+0.039\,V_{\text{street}}+0.175\,V_{\text{tired}}$ — overwhelmingly
      $V_{\text{animal}}$. A score gap of $3.0$ became a twentyfold weight gap: that sharpening is the exponential at work.</p>
    <p><b>Why $\sqrt{d_k}$?</b> If $q,k$ have unit-variance components, $q\cdot k$ has variance $d_k$, so scores grow like
      $\sqrt{d_k}$; large scores saturate softmax and kill its gradient. Dividing rescales them back to a learnable range.</p>`,

  code: String.raw`
    <p><i>Everything runnable and verified —</i> the from-scratch NumPy build, the PyTorch version,
      the causal mask, and the attention-weight heatmaps live in the companion notebook. Use
      <b>Open in Colab</b> at the top of this lesson. (Notebook pending.)</p>`,

  pitfalls: String.raw`
    <ul>
      <li><b>Forgot the causal mask.</b> Training loss looks suspiciously great because the model reads future tokens;
        generation then produces nonsense. The #1 GPT bug.</li>
      <li><b>Forgot the $\sqrt{d_k}$ scaling.</b> Scores get variance $d_k$, softmax saturates, gradients collapse, training stalls.</li>
      <li><b>No positional encoding.</b> The formula is order-agnostic — "dog bites man" equals "man bites dog" until you inject position.</li>
      <li><b>The $T\times T$ matrix explodes.</b> Memory grows with the square of sequence length; doubling context quadruples cost.</li>
      <li><b>Unmasked padding.</b> The model attends to $\langle\text{pad}\rangle$ tokens and learns noise — mask them with $-\infty$ too.</li>
    </ul>`
};
