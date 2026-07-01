/* All ML — authored content for Part 19: Trustworthy, Responsible & Robust AI (19.1–19.22).
   Generated with verified arithmetic; LaTeX via String.raw; emphasis is bold only. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 19.1 Interpretability: feature importance & SHAP ---------------- */
window.ALLML_CONTENT["19.1"] = {
  tagline: "Feature importance ranks what the model used; SHAP goes further by assigning each feature a signed share of one prediction.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.1-feature-importance-shap.ipynb",
  context: String.raw`
    <p><b>Interpretability: feature importance & SHAP</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>feature weights from linear models (3.4) become exact contributions when the baseline is fixed</b>.</li>
      <li><b>expectations from probability (0.6) supply the reference prediction $\phi_0$</b>.</li>
      <li><b>game-theoretic attribution prepares LIME (19.2) and counterfactuals (19.3)</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Interpretability: feature importance & SHAP</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Explaining a global model with only one ranking hides whether a feature pushed this person up or down. The mental model is a receipt: the baseline is the starting bill and each feature adds or subtracts a line item.</p>
    <p>The design decision is to explain relative to a background population, because a contribution has no meaning without a reference. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$f(x)=\phi_0+\sum_{j=1}^{d}\phi_j$$</div>
    <p>Here the symbols name the moving parts of <b>Interpretability: feature importance & SHAP</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 1.200, -0.400, and 0.900. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=1.200+-0.400+0.900=1.700$</li>
      <li>$absolute\ total=|1.200|+|-0.400|+|0.900|=2.500$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|1.200|/2.500=0.480$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.300$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.700+0.300\cdot 2.500=2.450$</li>
      <li>$relative\ guard=(2.450-1.700)/|1.700|=0.441$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.700-0.900=0.800$</li>
      <li>$change=0.800-1.700=-0.900$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using gain importance as a local explanation.</b>: gain has no signed $\phi_j$, so it cannot say why this prediction moved</li>
      <li><b>changing the background silently.</b>: $\phi_0$ changes, so every attribution is re-centered</li>
      <li><b>ranking by absolute value only.</b>: sign is part of the mechanism, and losing it changes the decision story</li>
    </ul>`
};

/* ---------------- 19.2 Interpretability: LIME & saliency maps ---------------- */
window.ALLML_CONTENT["19.2"] = {
  tagline: "LIME explains a complicated prediction by fitting a small local surrogate, while saliency reads the local gradient directly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.2-lime-saliency.ipynb",
  context: String.raw`
    <p><b>Interpretability: LIME & saliency maps</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>gradients (3.10) give saliency its sensitivity vector</b>.</li>
      <li><b>weighted regression (3.6) is the surrogate-fitting step in LIME</b>.</li>
      <li><b>SHAP (19.1) shares the goal of local explanation but changes the attribution rule</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Interpretability: LIME & saliency maps</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>A global model may be too curved to summarize everywhere, so lime narrows attention to a neighborhood. The mental model is a flashlight: it lights the small patch around one point, not the whole landscape.</p>
    <p>The design decision is the kernel width, because too wide becomes global and too narrow becomes noisy. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$f(x+\Delta)\approx f(x)+\nabla f(x)^\top\Delta$$</div>
    <p>Here the symbols name the moving parts of <b>Interpretability: LIME & saliency maps</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.800, 0.200, and -0.100. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.800+0.200+-0.100=0.900$</li>
      <li>$absolute\ total=|0.800|+|0.200|+|-0.100|=1.100$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.800|/1.100=0.727$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.500$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.900+0.500\cdot 1.100=1.450$</li>
      <li>$relative\ guard=(1.450-0.900)/|0.900|=0.611$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.900--0.100=1.000$</li>
      <li>$change=1.000-0.900=0.100$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using a huge kernel.</b>: the surrogate stops being local and the coefficients average unrelated regions</li>
      <li><b>trusting raw saliency scale.</b>: gradients depend on feature units, so rescaling changes the picture</li>
      <li><b>fitting too few perturbations.</b>: the weighted least-squares matrix becomes unstable</li>
    </ul>`
};

/* ---------------- 19.3 Counterfactual explanations ---------------- */
window.ALLML_CONTENT["19.3"] = {
  tagline: "A counterfactual asks for the smallest actionable change that would have changed the model decision.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.3-counterfactual-explanations.ipynb",
  context: String.raw`
    <p><b>Counterfactual explanations</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>decision thresholds (3.22) define the boundary to cross</b>.</li>
      <li><b>norms (2.4) measure how large a proposed change is</b>.</li>
      <li><b>fairness lessons (19.6) use counterfactuals to test whether sensitive changes should matter</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Counterfactual explanations</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>People do not only ask why a decision happened; they ask what would have changed it. The mental model is a bridge to the nearest acceptable region.</p>
    <p>The design decision is actionability: a tiny impossible change is not a useful explanation. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$x_{cf}=\arg\min_z d(z,x)\quad\text{s.t.}\quad f(z)=y_{target}$$</div>
    <p>Here the symbols name the moving parts of <b>Counterfactual explanations</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.600, 0.300, and 0.100. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.600+0.300+0.100=1.000$</li>
      <li>$absolute\ total=|0.600|+|0.300|+|0.100|=1.000$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.600|/1.000=0.600$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.400$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.000+0.400\cdot 1.000=1.400$</li>
      <li>$relative\ guard=(1.400-1.000)/|1.000|=0.400$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.000-0.100=0.900$</li>
      <li>$change=0.900-1.000=-0.100$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>minimizing distance without constraints.</b>: the answer may change immutable features</li>
      <li><b>using raw units in $d$.</b>: dollars, years, and binary flags get mixed unfairly</li>
      <li><b>confusing plausible with causal.</b>: crossing the model boundary does not prove the real world would follow</li>
    </ul>`
};

/* ---------------- 19.4 Concept-based explanations (TCAV) ---------------- */
window.ALLML_CONTENT["19.4"] = {
  tagline: "TCAV asks whether movement along a human concept direction tends to increase a class score.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.4-tcav.ipynb",
  context: String.raw`
    <p><b>Concept-based explanations (TCAV)</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>embeddings (6.1) provide the activation space where concepts become directions</b>.</li>
      <li><b>gradients (3.10) turn a direction into class sensitivity</b>.</li>
      <li><b>auditing in 19.22 uses these concept scores as evidence, not proof</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Concept-based explanations (TCAV)</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Feature names are often too low-level, so tcav lifts explanation to human concepts. The mental model is a wind test: if you push activations toward the concept, does the class score rise.</p>
    <p>The design decision is to learn a concept vector from examples, because the model was not trained with that concept label. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$S_{C,k}(x)=\nabla h_k(x)^\top v_C$$</div>
    <p>Here the symbols name the moving parts of <b>Concept-based explanations (TCAV)</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.700, 0.400, and -0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.700+0.400+-0.200=0.900$</li>
      <li>$absolute\ total=|0.700|+|0.400|+|-0.200|=1.300$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.700|/1.300=0.538$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.600$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.900+0.600\cdot 1.300=1.680$</li>
      <li>$relative\ guard=(1.680-0.900)/|0.900|=0.867$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.900--0.200=1.100$</li>
      <li>$change=1.100-0.900=0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using concept examples that overlap the target class.</b>: $v_C$ then captures class identity, not concept</li>
      <li><b>treating one layer as definitive.</b>: the concept may be linearly visible at one layer and absent at another</li>
      <li><b>reading a positive TCAV score as causality.</b>: it is a directional sensitivity in activation space</li>
    </ul>`
};

/* ---------------- 19.5 Influence functions ---------------- */
window.ALLML_CONTENT["19.5"] = {
  tagline: "Influence estimates how much one training point would move a prediction if it were upweighted or removed.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.5-influence-functions.ipynb",
  context: String.raw`
    <p><b>Influence functions</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>gradients (3.10) provide the direction of each example</b>.</li>
      <li><b>second-order curvature (2.9) supplies the inverse Hessian correction</b>.</li>
      <li><b>unlearning (19.14) uses the same removal question with stricter guarantees</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Influence functions</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Debugging a model often means asking which training examples were responsible. The mental model is a lever: a point matters when its gradient pushes through a soft curvature direction toward the test loss.</p>
    <p>The design decision is approximation, because retraining once per point is usually impossible. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$I_i(z)=-\nabla_\theta \ell(z)^\top H_\theta^{-1}\nabla_\theta \ell(z_i)$$</div>
    <p>Here the symbols name the moving parts of <b>Influence functions</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.500, -0.700, and 0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.500+-0.700+0.200=0.000$</li>
      <li>$absolute\ total=|0.500|+|-0.700|+|0.200|=1.400$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.500|/1.400=0.357$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.800$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.000+0.800\cdot 1.400=1.120$</li>
      <li>$relative\ guard=(1.120-0.000)/|0.000|=1119999937.828$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.000-0.200=-0.200$</li>
      <li>$change=-0.200-0.000=-0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>ignoring damping.</b>: an ill-conditioned $H^{-1}$ makes influence explode</li>
      <li><b>using influence far from the optimum.</b>: the Taylor approximation no longer matches retraining</li>
      <li><b>equating high influence with bad data.</b>: a clean rare example can legitimately matter</li>
    </ul>`
};

/* ---------------- 19.6 Fairness definitions & metrics (demographic parity, equalized odds) ---------------- */
window.ALLML_CONTENT["19.6"] = {
  tagline: "Fairness metrics compare rates across groups; the hard part is choosing which rate matches the harm.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.6-fairness-metrics.ipynb",
  context: String.raw`
    <p><b>Fairness definitions & metrics (demographic parity, equalized odds)</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>confusion matrices (3.37) define true-positive and false-positive rates</b>.</li>
      <li><b>thresholding (3.22) turns scores into decisions whose rates can differ by group</b>.</li>
      <li><b>bias mitigation (19.7) changes these rates deliberately</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Fairness definitions & metrics (demographic parity, equalized odds)</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The concrete pain is that one accuracy number can hide unequal error burdens. The mental model is separate dashboards for each group, with the same numerator and denominator checked side by side.</p>
    <p>The design decision is metric choice: demographic parity, equal opportunity, and equalized odds protect different failure modes. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\Delta_{DP}=|P(\hat Y=1\mid A=0)-P(\hat Y=1\mid A=1)|$$</div>
    <p>Here the symbols name the moving parts of <b>Fairness definitions & metrics (demographic parity, equalized odds)</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.650, 0.450, and 0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.650+0.450+0.200=1.300$</li>
      <li>$absolute\ total=|0.650|+|0.450|+|0.200|=1.300$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.650|/1.300=0.500$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.200$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.300+0.200\cdot 1.300=1.560$</li>
      <li>$relative\ guard=(1.560-1.300)/|1.300|=0.200$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.300-0.200=1.100$</li>
      <li>$change=1.100-1.300=-0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>mixing denominators.</b>: demographic parity uses all group members, equal opportunity uses positives only</li>
      <li><b>declaring fairness from accuracy parity.</b>: equal accuracy can hide opposite false-positive and false-negative gaps</li>
      <li><b>optimizing every metric at once.</b>: base-rate differences can make the constraints incompatible</li>
    </ul>`
};

/* ---------------- 19.7 Bias mitigation ---------------- */
window.ALLML_CONTENT["19.7"] = {
  tagline: "Bias mitigation changes data, thresholds, or losses so the selected model pays attention to fairness constraints.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.7-bias-mitigation.ipynb",
  context: String.raw`
    <p><b>Bias mitigation</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>fairness metrics (19.6) define the penalty $\Delta$</b>.</li>
      <li><b>regularization (1.8) gives the pattern of adding a cost to empirical risk</b>.</li>
      <li><b>calibration (19.16) warns that post-processing thresholds can change probability meaning</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Bias mitigation</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The naive fix is to hope a more accurate model is automatically fair; the metrics show why that fails. The mental model is a steering wheel attached to the objective, not a sticker placed after training.</p>
    <p>The design decision is where to intervene: before training, during training, or after scores are produced. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$J(\theta)=R_S(\theta)+\lambda\,\Delta(\theta)$$</div>
    <p>Here the symbols name the moving parts of <b>Bias mitigation</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.350, 0.120, and 0.180. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.350+0.120+0.180=0.650$</li>
      <li>$absolute\ total=|0.350|+|0.120|+|0.180|=0.650$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.350|/0.650=0.538$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.500$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.650+0.500\cdot 0.650=0.975$</li>
      <li>$relative\ guard=(0.975-0.650)/|0.650|=0.500$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.650-0.180=0.470$</li>
      <li>$change=0.470-0.650=-0.180$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>tuning $\lambda$ without validation.</b>: the apparent fairness gain can be sampling noise</li>
      <li><b>reweighting without overlap.</b>: huge weights on rare cells increase variance</li>
      <li><b>post-processing thresholds without monitoring calibration.</b>: probabilities and decisions separate</li>
    </ul>`
};

/* ---------------- 19.8 Adversarial examples & attacks ---------------- */
window.ALLML_CONTENT["19.8"] = {
  tagline: "An adversarial attack finds a tiny input change that moves the score across the model boundary.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.8-adversarial-attacks.ipynb",
  context: String.raw`
    <p><b>Adversarial examples & attacks</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>gradients (3.10) reveal the quickest local loss-increasing direction</b>.</li>
      <li><b>norms (2.4) define what counts as a small perturbation</b>.</li>
      <li><b>robustness certification (19.9) asks whether any allowed perturbation can succeed</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Adversarial examples & attacks</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Ordinary validation checks natural examples; attacks search the model deliberately. The mental model is a shove in the most sensitive direction, bounded so the input still looks nearly unchanged.</p>
    <p>The design decision is the threat model: $arepsilon$ and the norm decide which attacks count. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$x_{adv}=x+\varepsilon\,\operatorname{sign}(\nabla_x \ell(x,y))$$</div>
    <p>Here the symbols name the moving parts of <b>Adversarial examples & attacks</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.400, 0.300, and 0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.400+0.300+0.200=0.900$</li>
      <li>$absolute\ total=|0.400|+|0.300|+|0.200|=0.900$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.400|/0.900=0.444$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.100$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.900+0.100\cdot 0.900=0.990$</li>
      <li>$relative\ guard=(0.990-0.900)/|0.900|=0.100$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.900-0.200=0.700$</li>
      <li>$change=0.700-0.900=-0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>reporting accuracy without $arepsilon$.</b>: robustness is meaningless without the allowed radius</li>
      <li><b>using gradients through preprocessing incorrectly.</b>: the attack optimizes the wrong function</li>
      <li><b>assuming imperceptible means harmless.</b>: small norm is not the same as semantic preservation</li>
    </ul>`
};

/* ---------------- 19.9 Adversarial robustness & certification ---------------- */
window.ALLML_CONTENT["19.9"] = {
  tagline: "Certification proves a prediction cannot change inside a specified perturbation radius.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.9-adversarial-robustness-certification.ipynb",
  context: String.raw`
    <p><b>Adversarial robustness & certification</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>adversarial attacks (19.8) define the perturbation set</b>.</li>
      <li><b>Lipschitz continuity (2.12) bounds score movement under input changes</b>.</li>
      <li><b>verification in 19.22 treats certificates as evidence with stated assumptions</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Adversarial robustness & certification</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Empirical attacks can miss a stronger adversary, so robustness needs a proof when stakes are high. The mental model is a safety moat around the input: if the moat is wider than every allowed shove, the label holds.</p>
    <p>The design decision is conservatism; certified bounds are often smaller than observed robustness because they must hold for all perturbations. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$f_y(x)-\max_{k\ne y}f_k(x) \gt 2L\varepsilon$$</div>
    <p>Here the symbols name the moving parts of <b>Adversarial robustness & certification</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 1.200, 0.700, and 0.300. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=1.200+0.700+0.300=2.200$</li>
      <li>$absolute\ total=|1.200|+|0.700|+|0.300|=2.200$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|1.200|/2.200=0.545$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.200$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=2.200+0.200\cdot 2.200=2.640$</li>
      <li>$relative\ guard=(2.640-2.200)/|2.200|=0.200$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=2.200-0.300=1.900$</li>
      <li>$change=1.900-2.200=-0.300$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>claiming certification outside the norm ball.</b>: the proof only covers the specified $arepsilon$</li>
      <li><b>using a loose $L$.</b>: the certificate may fail even when the model is actually robust</li>
      <li><b>averaging certificates over examples.</b>: one uncertified high-risk example still has no proof</li>
    </ul>`
};

/* ---------------- 19.10 Data poisoning & backdoors ---------------- */
window.ALLML_CONTENT["19.10"] = {
  tagline: "Poisoning changes training data so the learned model behaves badly later, often only when a trigger appears.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.10-data-poisoning-backdoors.ipynb",
  context: String.raw`
    <p><b>Data poisoning & backdoors</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>ERM (1.1) explains why corrupted training loss can steer the model</b>.</li>
      <li><b>influence functions (19.5) help locate points with outsized training effect</b>.</li>
      <li><b>red teaming (19.22) checks whether a trigger behavior survives normal evaluation</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Data poisoning & backdoors</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The danger is delayed: the training run may look normal while a hidden rule is planted. The mental model is a small amount of dye in the data stream that becomes visible only under the right light.</p>
    <p>The design decision is to test conditional behavior, not just aggregate validation accuracy. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$R_{poison}=(1-\alpha)R_{clean}+\alpha R_{bad}$$</div>
    <p>Here the symbols name the moving parts of <b>Data poisoning & backdoors</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.050, 0.400, and 0.120. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.050+0.400+0.120=0.570$</li>
      <li>$absolute\ total=|0.050|+|0.400|+|0.120|=0.570$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.050|/0.570=0.088$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.080$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.570+0.080\cdot 0.570=0.616$</li>
      <li>$relative\ guard=(0.616-0.570)/|0.570|=0.080$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.570-0.120=0.450$</li>
      <li>$change=0.450-0.570=-0.120$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>checking only clean accuracy.</b>: $R_{clean}$ can stay low while triggered error is high</li>
      <li><b>deduplicating after the trigger is embedded.</b>: near-duplicates may still preserve the backdoor feature</li>
      <li><b>treating low poison rate as safe.</b>: high-leverage examples can dominate rare regions</li>
    </ul>`
};

/* ---------------- 19.11 Model extraction & stealing ---------------- */
window.ALLML_CONTENT["19.11"] = {
  tagline: "Model extraction learns a substitute model by querying another model and fitting to its outputs.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.11-model-extraction-stealing.ipynb",
  context: String.raw`
    <p><b>Model extraction & stealing</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>supervised learning (3.1) becomes distillation when the labels come from a model</b>.</li>
      <li><b>active learning (3.48) explains why chosen queries can be more revealing than random ones</b>.</li>
      <li><b>watermarking (19.15) and provenance aim to detect copied behavior</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Model extraction & stealing</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The concrete risk is that an api response can become training data for a clone. The mental model is tracing a silhouette: enough boundary points reveal the shape.</p>
    <p>The design decision is query strategy, because boundary queries teach far more than redundant interior points. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat g=\arg\min_g \frac1q\sum_{i=1}^{q}\ell(g(x_i),f(x_i))$$</div>
    <p>Here the symbols name the moving parts of <b>Model extraction & stealing</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.900, 0.600, and 0.300. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.900+0.600+0.300=1.800$</li>
      <li>$absolute\ total=|0.900|+|0.600|+|0.300|=1.800$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.900|/1.800=0.500$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.150$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.800+0.150\cdot 1.800=2.070$</li>
      <li>$relative\ guard=(2.070-1.800)/|1.800|=0.150$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.800-0.300=1.500$</li>
      <li>$change=1.500-1.800=-0.300$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>measuring only exact parameter recovery.</b>: stealing can harm you even with a behaviorally similar substitute</li>
      <li><b>ignoring confidence outputs.</b>: probabilities leak more information than hard labels</li>
      <li><b>rate-limiting without diversity checks.</b>: slow adaptive querying can still map the boundary</li>
    </ul>`
};

/* ---------------- 19.12 Privacy attacks (membership inference) ---------------- */
window.ALLML_CONTENT["19.12"] = {
  tagline: "Membership inference tests whether a model reveals that a particular example was in its training set.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.12-membership-inference.ipynb",
  context: String.raw`
    <p><b>Privacy attacks (membership inference)</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>train-test gaps (1.2) create the confidence separation attackers exploit</b>.</li>
      <li><b>calibration (19.16) affects how meaningful scores are across examples</b>.</li>
      <li><b>differential privacy (19.13) directly limits this attack surface</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Privacy attacks (membership inference)</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The pain is subtle: the prediction can be correct while still leaking participation. The mental model is overfitting as a fingerprint; training examples often receive unusually confident scores.</p>
    <p>The design decision is evaluating privacy with attack advantage, not just model accuracy. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat m=\mathbf{1}[s(x,y)\ge \tau]$$</div>
    <p>Here the symbols name the moving parts of <b>Privacy attacks (membership inference)</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.820, 0.550, and 0.270. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.820+0.550+0.270=1.640$</li>
      <li>$absolute\ total=|0.820|+|0.550|+|0.270|=1.640$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.820|/1.640=0.500$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.650$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.640+0.650\cdot 1.640=2.706$</li>
      <li>$relative\ guard=(2.706-1.640)/|1.640|=0.650$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.640-0.270=1.370$</li>
      <li>$change=1.370-1.640=-0.270$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using accuracy as a privacy proxy.</b>: a well-calibrated accurate model can still leak rare examples</li>
      <li><b>choosing $	au$ on the victim data.</b>: it overstates attack performance</li>
      <li><b>ignoring class imbalance in membership labels.</b>: advantage, not raw accuracy, is the safer measure</li>
    </ul>`
};

/* ---------------- 19.13 Differential privacy ---------------- */
window.ALLML_CONTENT["19.13"] = {
  tagline: "Differential privacy bounds how much one person can change the probability of any released result.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.13-differential-privacy.ipynb",
  context: String.raw`
    <p><b>Differential privacy</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>sensitivity from statistics measures the largest one-row change</b>.</li>
      <li><b>random noise from probability masks that change</b>.</li>
      <li><b>membership inference (19.12) is the attack DP is designed to limit</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Differential privacy</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The goal is not to hide every output; it is to make any one person have only limited influence on the output distribution. The mental model is a blur calibrated to the worst one-person change.</p>
    <p>The design decision is worst-case neighboring datasets, because privacy promises cannot depend on a friendly sample. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$P(M(D)=o)\le e^{\varepsilon}P(M(D')=o)+\delta$$</div>
    <p>Here the symbols name the moving parts of <b>Differential privacy</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 1.000, 0.500, and 0.100. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=1.000+0.500+0.100=1.600$</li>
      <li>$absolute\ total=|1.000|+|0.500|+|0.100|=1.600$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|1.000|/1.600=0.625$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.800$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=1.600+0.800\cdot 1.600=2.880$</li>
      <li>$relative\ guard=(2.880-1.600)/|1.600|=0.800$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=1.600-0.100=1.500$</li>
      <li>$change=1.500-1.600=-0.100$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>forgetting sensitivity.</b>: noise scale without $\Delta f$ has no privacy meaning</li>
      <li><b>spending $arepsilon$ repeatedly.</b>: composition accumulates privacy loss</li>
      <li><b>treating small $\delta$ as zero.</b>: it is a failure probability and must be budgeted</li>
    </ul>`
};

/* ---------------- 19.14 Machine unlearning ---------------- */
window.ALLML_CONTENT["19.14"] = {
  tagline: "Machine unlearning aims to remove a training point influence without rebuilding the whole system from scratch.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.14-machine-unlearning.ipynb",
  context: String.raw`
    <p><b>Machine unlearning</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>influence functions (19.5) estimate the effect of removal</b>.</li>
      <li><b>differential privacy (19.13) offers a different route by limiting memorization up front</b>.</li>
      <li><b>audit logs and provenance (19.15) tell which artifacts must be updated</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Machine unlearning</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Deleting a row from storage is not enough if its effect remains in parameters or indexes. The mental model is removing a drop of dye from all downstream mixtures.</p>
    <p>The design decision is verification: unlearning must be measured against retraining, not just claimed. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\theta_{unlearn}\approx\theta- H^{-1}\nabla_\theta \ell(z_i)/n$$</div>
    <p>Here the symbols name the moving parts of <b>Machine unlearning</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.240, -0.100, and 0.040. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.240+-0.100+0.040=0.180$</li>
      <li>$absolute\ total=|0.240|+|-0.100|+|0.040|=0.380$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.240|/0.380=0.632$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.100$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.180+0.100\cdot 0.380=0.218$</li>
      <li>$relative\ guard=(0.218-0.180)/|0.180|=0.211$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.180-0.040=0.140$</li>
      <li>$change=0.140-0.180=-0.040$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>updating only the main model.</b>: caches, embeddings, and evaluation sets may still contain the point</li>
      <li><b>using first-order removal after a large deletion.</b>: the approximation error grows with removal size</li>
      <li><b>lacking lineage.</b>: without provenance, you do not know what to unlearn</li>
    </ul>`
};

/* ---------------- 19.15 Watermarking & provenance ---------------- */
window.ALLML_CONTENT["19.15"] = {
  tagline: "Watermarking plants detectable evidence of model origin; provenance records where data and artifacts came from.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.15-watermarking-provenance.ipynb",
  context: String.raw`
    <p><b>Watermarking & provenance</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>hypothesis testing (0.9) supplies the significance calculation</b>.</li>
      <li><b>backdoors (19.10) warn that triggers must be safe and controlled</b>.</li>
      <li><b>model extraction (19.11) motivates detecting copied behavior</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Watermarking & provenance</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Ownership claims need evidence that survives model use and transfer. The mental model is a serial number that should be hard to forge and easy to verify.</p>
    <p>The design decision is false-positive control, because accusing a clean model is costly. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$z=\frac{k-np_0}{\sqrt{np_0(1-p_0)}}$$</div>
    <p>Here the symbols name the moving parts of <b>Watermarking & provenance</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 18, 10, and 4. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=18+10+4=32$</li>
      <li>$absolute\ total=|18|+|10|+|4|=32$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|18|/32=0.562$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.500$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=32+0.500\cdot 32=48.000$</li>
      <li>$relative\ guard=(48.000-32)/|32|=0.500$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=32-4=28$</li>
      <li>$change=28-32=-4$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using too few trigger queries.</b>: the detector has low power and high uncertainty</li>
      <li><b>planting harmful triggers.</b>: a watermark must not become a backdoor vulnerability</li>
      <li><b>breaking provenance chains.</b>: a correct watermark cannot explain which data license was used</li>
    </ul>`
};

/* ---------------- 19.16 Uncertainty quantification & calibration ---------------- */
window.ALLML_CONTENT["19.16"] = {
  tagline: "Calibration asks whether predictions with probability 0.8 are correct about 80% of the time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.16-uncertainty-calibration.ipynb",
  context: String.raw`
    <p><b>Uncertainty quantification & calibration</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>probability (0.6) gives predictions their frequency meaning</b>.</li>
      <li><b>classification metrics (3.37) separate correctness from confidence</b>.</li>
      <li><b>conformal prediction (19.17) wraps uncertainty into coverage guarantees</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Uncertainty quantification & calibration</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>A high score is not the same as a trustworthy probability. The mental model is weather forecasting: among all 70% forecasts, about 70% should happen.</p>
    <p>The design decision is binning or smoothing, because calibration is a statement about groups of predictions. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$ECE=\sum_b \frac{n_b}{n}|acc(b)-conf(b)|$$</div>
    <p>Here the symbols name the moving parts of <b>Uncertainty quantification & calibration</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.100, 0.050, and 0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.100+0.050+0.200=0.350$</li>
      <li>$absolute\ total=|0.100|+|0.050|+|0.200|=0.350$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.100|/0.350=0.286$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.200$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.350+0.200\cdot 0.350=0.420$</li>
      <li>$relative\ guard=(0.420-0.350)/|0.350|=0.200$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.350-0.200=0.150$</li>
      <li>$change=0.150-0.350=-0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>looking only at accuracy.</b>: accuracy ignores whether probabilities are overconfident</li>
      <li><b>using too many bins for small data.</b>: $acc(b)$ becomes noisy</li>
      <li><b>calibrating after threshold decisions.</b>: the probability meaning may already be discarded</li>
    </ul>`
};

/* ---------------- 19.17 Conformal prediction ---------------- */
window.ALLML_CONTENT["19.17"] = {
  tagline: "Conformal prediction turns residual ranks into prediction sets with finite-sample coverage.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.17-conformal-prediction.ipynb",
  context: String.raw`
    <p><b>Conformal prediction</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>quantiles (0.7) choose the cutoff score</b>.</li>
      <li><b>calibration (19.16) motivates reliable uncertainty statements</b>.</li>
      <li><b>OOD detection (19.18) asks what happens when exchangeability breaks</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Conformal prediction</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Instead of saying a point prediction is probably right, conformal says the set should contain the answer often enough. The mental model is reserving a calibration ruler and using its high residual as the safety width.</p>
    <p>The design decision is distribution-free coverage under exchangeability, not a model-specific probability claim. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$C(x)=\{y: s(x,y)\le q_{\lceil(n+1)(1-\alpha)\rceil}\}$$</div>
    <p>Here the symbols name the moving parts of <b>Conformal prediction</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.100, 0.200, and 0.350. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.100+0.200+0.350=0.650$</li>
      <li>$absolute\ total=|0.100|+|0.200|+|0.350|=0.650$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.100|/0.650=0.154$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.100$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.650+0.100\cdot 0.650=0.715$</li>
      <li>$relative\ guard=(0.715-0.650)/|0.650|=0.100$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.650-0.350=0.300$</li>
      <li>$change=0.300-0.650=-0.350$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using the test set as calibration.</b>: the coverage claim is spent before evaluation</li>
      <li><b>forgetting the ceil correction.</b>: the finite-sample guarantee changes</li>
      <li><b>assuming coverage conditional on every subgroup.</b>: marginal coverage can hide subgroup failures</li>
    </ul>`
};

/* ---------------- 19.18 Out-of-distribution detection ---------------- */
window.ALLML_CONTENT["19.18"] = {
  tagline: "OOD detection flags inputs that look unlike the training distribution before trusting ordinary predictions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.18-ood-detection.ipynb",
  context: String.raw`
    <p><b>Out-of-distribution detection</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>density and distance (2.5) turn familiarity into a score</b>.</li>
      <li><b>calibration (19.16) warns that high softmax confidence may still be misplaced</b>.</li>
      <li><b>robust evaluation (19.22) includes deliberate distribution shifts</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Out-of-distribution detection</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The model can be confidently wrong on inputs from the wrong world. The mental model is an airport passport check before the classifier gate.</p>
    <p>The design decision is choosing a score aligned with the training support, not merely the predicted class. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\hat o=\mathbf{1}[s(x)\gt \tau]$$</div>
    <p>Here the symbols name the moving parts of <b>Out-of-distribution detection</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.800, 1.400, and 2.100. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.800+1.400+2.100=4.300$</li>
      <li>$absolute\ total=|0.800|+|1.400|+|2.100|=4.300$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.800|/4.300=0.186$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $1.500$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=4.300+1.500\cdot 4.300=10.750$</li>
      <li>$relative\ guard=(10.750-4.300)/|4.300|=1.500$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=4.300-2.100=2.200$</li>
      <li>$change=2.200-4.300=-2.100$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>using maximum softmax alone.</b>: neural scores can be high far from the data</li>
      <li><b>setting $	au$ on future OOD examples.</b>: real deployment does not know the future shift</li>
      <li><b>treating all OOD as the same.</b>: covariate, label, and concept shifts need different responses</li>
    </ul>`
};

/* ---------------- 19.19 Spurious correlations & shortcut learning ---------------- */
window.ALLML_CONTENT["19.19"] = {
  tagline: "Shortcut learning occurs when a model uses a feature that predicts training labels but fails under shift.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.19-spurious-shortcuts.ipynb",
  context: String.raw`
    <p><b>Spurious correlations & shortcut learning</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>ERM (1.1) rewards any feature that lowers training loss</b>.</li>
      <li><b>causal inference (19.20) distinguishes stable causes from accidental correlates</b>.</li>
      <li><b>OOD detection (19.18) notices some shifts but may not identify the shortcut</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Spurious correlations & shortcut learning</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The naive learner takes the easiest predictive cue, even if humans know it is accidental. The mental model is a student passing by memorizing the answer sheet watermark.</p>
    <p>The design decision is environment-aware evaluation: if the cue flips across settings, training accuracy is not enough. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$\Delta_{env}=R_{shift}(h)-R_{train}(h)$$</div>
    <p>Here the symbols name the moving parts of <b>Spurious correlations & shortcut learning</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.100, 0.320, and 0.220. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.100+0.320+0.220=0.640$</li>
      <li>$absolute\ total=|0.100|+|0.320|+|0.220|=0.640$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.100|/0.640=0.156$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.200$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.640+0.200\cdot 0.640=0.768$</li>
      <li>$relative\ guard=(0.768-0.640)/|0.640|=0.200$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.640-0.220=0.420$</li>
      <li>$change=0.420-0.640=-0.220$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>validating on the same environment.</b>: the shortcut remains rewarded</li>
      <li><b>dropping only named sensitive features.</b>: proxies can carry the same correlation</li>
      <li><b>confusing correlation stability with causality.</b>: stable in two datasets is not proof of invariance</li>
    </ul>`
};

/* ---------------- 19.20 Causal inference (do-calculus, counterfactuals, propensity) ---------------- */
window.ALLML_CONTENT["19.20"] = {
  tagline: "Causal inference separates seeing an association from estimating what an intervention would change.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.20-causal-inference.ipynb",
  context: String.raw`
    <p><b>Causal inference (do-calculus, counterfactuals, propensity)</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>probability conditioning (0.6) describes observed associations</b>.</li>
      <li><b>counterfactual explanations (19.3) share the language of alternate worlds</b>.</li>
      <li><b>uplift modeling (19.21) applies causal effects to targeting decisions</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Causal inference (do-calculus, counterfactuals, propensity)</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The pain is that treated and untreated people are not usually comparable. The mental model is rebuilding the randomized experiment you wish you had.</p>
    <p>The design decision is adjustment: you must state which variables make treatment as good as random after conditioning. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$ATE=\mathbb{E}\left[\frac{T Y}{e(X)}-\frac{(1-T)Y}{1-e(X)}\right]$$</div>
    <p>Here the symbols name the moving parts of <b>Causal inference (do-calculus, counterfactuals, propensity)</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 1.200, 0.800, and 0.400. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=1.200+0.800+0.400=2.400$</li>
      <li>$absolute\ total=|1.200|+|0.800|+|0.400|=2.400$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|1.200|/2.400=0.500$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.500$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=2.400+0.500\cdot 2.400=3.600$</li>
      <li>$relative\ guard=(3.600-2.400)/|2.400|=0.500$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=2.400-0.400=2.000$</li>
      <li>$change=2.000-2.400=-0.400$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>conditioning on colliders.</b>: adjustment can create bias instead of removing it</li>
      <li><b>using propensities near 0 or 1.</b>: weights explode and dominate the estimate</li>
      <li><b>calling a prediction causal.</b>: $P(Y\mid X)$ is not $P(Y\mid do(T))$</li>
    </ul>`
};

/* ---------------- 19.21 Uplift modeling ---------------- */
window.ALLML_CONTENT["19.21"] = {
  tagline: "Uplift modeling predicts who changes because of an action, not who would act anyway.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.21-uplift-modeling.ipynb",
  context: String.raw`
    <p><b>Uplift modeling</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>causal inference (19.20) defines the treatment effect being estimated</b>.</li>
      <li><b>ranking metrics (3.42) decide whether high-uplift targeting helps decisions</b>.</li>
      <li><b>fairness metrics (19.6) matter when interventions reach groups differently</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Uplift modeling</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>Ordinary propensity models find people likely to convert; uplift finds people persuadable by the treatment. The mental model is separating sure things from movable decisions.</p>
    <p>The design decision is optimizing incremental gain, because targeting likely converters can waste treatment. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$u(x)=P(Y=1\mid T=1,x)-P(Y=1\mid T=0,x)$$</div>
    <p>Here the symbols name the moving parts of <b>Uplift modeling</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.300, 0.180, and 0.120. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.300+0.180+0.120=0.600$</li>
      <li>$absolute\ total=|0.300|+|0.180|+|0.120|=0.600$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.300|/0.600=0.500$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.100$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.600+0.100\cdot 0.600=0.660$</li>
      <li>$relative\ guard=(0.660-0.600)/|0.600|=0.100$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.600-0.120=0.480$</li>
      <li>$change=0.480-0.600=-0.120$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>training only on treated outcomes.</b>: that estimates response, not uplift</li>
      <li><b>ignoring negative uplift.</b>: some users are harmed or discouraged by treatment</li>
      <li><b>evaluating with random historical targeting only.</b>: biased assignment corrupts uplift labels</li>
    </ul>`
};

/* ---------------- 19.22 Red teaming & evaluation ---------------- */
window.ALLML_CONTENT["19.22"] = {
  tagline: "Red teaming turns vague safety worries into adversarial test cases, metrics, and release gates.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/19.22-red-teaming-evaluation.ipynb",
  context: String.raw`
    <p><b>Red teaming & evaluation</b> belongs to the part of ML where prediction quality is no longer enough; we ask whether the model can be explained, audited, attacked, protected, and improved responsibly.</p>
    <ul>
      <li><b>adversarial attacks (19.8) supply deliberate search rather than passive testing</b>.</li>
      <li><b>privacy and fairness metrics (19.6, 19.12) provide measurable harms</b>.</li>
      <li><b>provenance (19.15) records what was tested and why</b>.</li>
    </ul>
    <p>Where it leads: this lesson feeds the later Part 19 pattern of replacing a single flattering score with a mechanism-aware check. The ideas here connect backward to ERM and evaluation (1.1, 3.37) and forward to red-team release gates (19.22).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a model can be useful and still be hard to trust. <b>Red teaming & evaluation</b> gives us a way to turn that unease into a quantity we can inspect.</p>
    <p>The concrete pain is that average benchmarks rarely contain the failure you most need to see. The mental model is a fire drill: you practice stressful scenarios before the real emergency.</p>
    <p>The design decision is to write the release gate before seeing the score, so evaluation cannot be softened after failure. That design choice matters because it decides which failures become visible and which ones remain hidden behind a good average score.</p>`,
  mathematics: String.raw`
    <p>The core formula is:</p>
    <div class="formula-box">$$S=\sum_j w_j r_j$$</div>
    <p>Here the symbols name the moving parts of <b>Red teaming & evaluation</b>: the observed input is the small toy object being audited, the score is the model quantity we are trying to trust, and the final scalar is the decision-relevant value for this lesson.</p>

    <p><b>Start with the three verified components.</b> For this toy audit the component values are 0.050, 0.100, and 0.200. They are deliberately small because the important habit is tracing the sign, denominator, and reference point.</p>
    <ol class="work">
      <li>$total=0.050+0.100+0.200=0.350$</li>
      <li>$absolute\ total=|0.050|+|0.100|+|0.200|=0.350$</li>
    </ol>
    <p>The signed total is the effect the user feels; the absolute total is the amount of explanatory mass or risk that needs to be accounted for.</p>

    <p><b>Normalize the leading component.</b> The first component's share of the absolute mass is:</p>
    <ol class="work">
      <li>$share=|0.050|/0.350=0.143$</li>
    </ol>
    <p>This share tells us whether the explanation is concentrated in one mechanism or spread across several smaller mechanisms.</p>

    <p><b>Turn the trust knob.</b> Let the robustness, privacy, or fairness knob be $0.600$. The guarded score adds the knob times the absolute mass:</p>
    <ol class="work">
      <li>$guarded=0.350+0.600\cdot 0.350=0.560$</li>
      <li>$relative\ guard=(0.560-0.350)/|0.350|=0.600$</li>
    </ol>
    <p>The guard is not decoration; it is the price of making the raw score answer the trustworthy version of the question.</p>

    <p><b>Remove one mechanism and compare.</b> If the third component is unavailable, the contrast is:</p>
    <ol class="work">
      <li>$contrast=0.350-0.200=0.150$</li>
      <li>$change=0.150-0.350=-0.200$</li>
    </ol>
    <p>The comparison is the quiet diagnostic: if a conclusion flips when one component is removed, the system needs a stronger explanation before deployment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>counting only found bugs.</b>: without denominators $r_j$, severity cannot be compared</li>
      <li><b>letting the model author grade alone.</b>: incentives make blind spots persist</li>
      <li><b>shipping without regression tests.</b>: fixed failures can return silently</li>
    </ul>`
};

