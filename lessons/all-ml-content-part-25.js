/* All ML — authored content for Part 25: Neurosymbolic AI & Program Synthesis (25.1–25.5).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 25.1 Neurosymbolic integration ---------------- */
window.ALLML_CONTENT["25.1"] = {
  tagline: "Neurosymbolic systems keep neural uncertainty, but ask it to pay a real price when it violates a rule.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/25.1-neurosymbolic-integration.ipynb",
  context: String.raw`
    <p>This lesson joins two streams you have already learned to keep separate.</p>
    <ul>
      <li><b>Neural probabilities</b> from classification and calibration give each predicate a soft truth value, not just a hard yes-or-no label.</li>
      <li><b>Loss functions</b> turn wrong predictions into a quantity gradients can reduce; the same mechanism will turn rule violations into a trainable penalty.</li>
      <li><b>Logic</b> from discrete mathematics supplies the structure: AND, OR, implication, and constraints such as "if a condition is true, a consequence should be true."</li>
    </ul>
    <p>Where it leads: neurosymbolic integration is the bridge into inductive logic programming (25.2), differentiable programming (25.3), program synthesis (25.4), and neural theorem proving (25.5). The later lessons change the search space, but they keep the same central question: how can a learned system respect symbolic structure without giving up uncertainty?</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: a neural model may fit examples while breaking facts we already know. A medical classifier may assign high probability to mutually incompatible diagnoses; a scene model may say an object is both inside and outside a container; a recommender may violate a business rule. Pure neural training treats those mistakes as ordinary data noise. Pure symbolic logic rejects uncertainty and breaks as soon as a perception score is not exactly true or false.</p>
    <p>Neurosymbolic integration chooses the middle path. Let the neural model speak in probabilities, reinterpret those probabilities as <b>fuzzy truth values</b>, and add a differentiable penalty when a symbolic rule is unsatisfied. The mental model is a teacher standing beside the learner: the data says "match these labels," while the rule says "also stay inside this legal region."</p>
    <p>The design decision people gloss over is <b>where</b> the rule enters. If we hard-filter predictions after training, the model never learns why it was wrong. If we add the rule as a loss term during training, the violation becomes part of the gradient signal. That is why neurosymbolic systems usually soften logic: not because logic is vague, but because gradients need a slope.</p>`,
  mathematics: String.raw`
    <p>Let $p_i\\in[0,1]$ be the neural probability for example $i$, $y_i\\in\\{0,1\\}$ its label, $A,B\\in[0,1]$ two predicate truth values, and $\\lambda\\ge0$ the weight placed on symbolic consistency. A common objective is</p>
    <div class="formula-box">$$L_{total}=L_{neural}+\\lambda(1-S_{rule}),\\qquad L_{neural}=\\frac1m\\sum_{i=1}^{m} -y_i\\log p_i-(1-y_i)\\log(1-p_i).$$</div>
    <p>Here $S_{rule}\\in[0,1]$ is the soft satisfaction of a rule. In the companion notebook we use product AND, probabilistic OR, and a simple implication satisfaction:</p>
    <div class="formula-box">$$A\\wedge B=AB,\\qquad A\\vee B=A+B-AB,\\qquad A\\Rightarrow B=\\max(1-A,B).$$</div>

    <p><b>Neural truth values.</b> Take probabilities $p=\{0.20,0.70,0.90\}$ and labels $y=\{0,1,1\}$. The binary cross-entropy terms are:</p>
    <ol class="work">
      <li>example 1: $-\\log(1-0.20)=-\\log 0.80=0.2231435513142097$</li>
      <li>example 2: $-\\log(0.70)=0.35667494393873245$</li>
      <li>example 3: $-\\log(0.90)=0.10536051565782628$</li>
      <li>mean: $(0.2231435513142097+0.35667494393873245+0.10536051565782628)/3=0.22839300363692283$</li>
    </ol>
    <p>The model is mostly right, so the data loss is small but not zero; those same probabilities can now serve as soft logic inputs instead of being rounded away.</p>

    <p><b>Differentiable connectives.</b> For $A=0.70$ and $B=0.60$:</p>
    <ol class="work">
      <li>AND: $A\\wedge B=0.70\\cdot0.60=0.42$</li>
      <li>OR: $A\\vee B=0.70+0.60-0.70\\cdot0.60=1.30-0.42=0.88$</li>
    </ol>
    <p>The AND only becomes high when both inputs are high, while the OR becomes high when either input helps. These surfaces are smooth, so changing a neural score changes the rule satisfaction gradually instead of flipping a brittle switch.</p>

    <p><b>Implication as a rule penalty.</b> For three cases with $A=\{0.2,0.7,0.9\}$ and $B=\{0.8,0.6,0.4\}$:</p>
    <ol class="work">
      <li>case 1: $\\max(1-0.2,0.8)=\\max(0.8,0.8)=0.8$, penalty $=1-0.8=0.2$</li>
      <li>case 2: $\\max(1-0.7,0.6)=\\max(0.3,0.6)=0.6$, penalty $=0.4$</li>
      <li>case 3: $\\max(1-0.9,0.4)=\\max(0.1,0.4)=0.4$, penalty $=0.6$</li>
    </ol>
    <p>The largest violation is the third case: the premise is very true while the consequence is weak, so the rule loss points directly at the mismatch.</p>

    <p><b>Combining data fit and the rule.</b> With $L_{neural}=0.22839300363692283$ and rule penalty $0.4$:</p>
    <ol class="work">
      <li>$\\lambda=0$: $0.22839300363692283+0\\cdot0.4=0.22839300363692283$</li>
      <li>$\\lambda=0.5$: $0.22839300363692283+0.5\\cdot0.4=0.42839300363692284$</li>
      <li>$\\lambda=1$: $0.22839300363692283+1\\cdot0.4=0.6283930036369228$</li>
      <li>$\\lambda=2$: $0.22839300363692283+2\\cdot0.4=1.0283930036369228$</li>
      <li>$\\lambda=5$: $0.22839300363692283+5\\cdot0.4=2.228393003636923$</li>
    </ol>
    <p>The knob $\\lambda$ is not decoration; it is the system's moral weight on consistency. Setting it too low ignores the rule, and setting it too high can make the model satisfy the rule while forgetting the data.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Rounding probabilities before the rule.</b> If $A$ and $B$ are forced to $0$ or $1$, the smooth surfaces $AB$ and $A+B-AB$ lose the gradients that made the rule trainable.</li>
      <li><b>Treating $\\lambda$ as harmless.</b> In $L_{total}=L_{neural}+\\lambda(1-S_{rule})$, the rule gradient scales linearly with $\\lambda$; a large value can dominate the data term.</li>
      <li><b>Using the wrong connective for the meaning.</b> Product AND makes partial truths multiply, so two uncertain predicates can become very small; that is right for joint evidence but too harsh for some constraints.</li>
      <li><b>Confusing satisfaction with truth.</b> $S_{rule}$ measures whether a rule is obeyed under the chosen relaxation, not whether the world itself is logically certain.</li>
    </ul>`
};

/* ---------------- 25.2 Inductive logic programming ---------------- */
window.ALLML_CONTENT["25.2"] = {
  tagline: "Inductive logic programming searches for a rule whose symbolic coverage explains the examples and rejects the counterexamples.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/25.2-inductive-logic-programming.ipynb",
  context: String.raw`
    <p>Inductive logic programming, or ILP, is what happens when learning is asked to produce a readable rule rather than a vector of weights.</p>
    <ul>
      <li><b>First-order logic</b> supplies variables such as $X,Y,Z$ and predicates such as $parent(X,Y)$; ILP searches over clauses built from them.</li>
      <li><b>Supervised learning</b> supplies positive and negative examples; here they become ground atoms the rule should cover or avoid.</li>
      <li><b>Neurosymbolic integration (25.1)</b> showed how rules can regularize neural scores; ILP asks how rules themselves can be learned.</li>
    </ul>
    <p>Where it leads: ILP is the symbolic ancestor of program synthesis (25.4), and neural theorem proving (25.5) relaxes its exact matching into soft proof scores. The later methods trade some interpretability for robustness and search efficiency.</p>`,
  intuition: String.raw`
    <p>The concrete problem is relational generalization. Seeing that Ann is Bob's parent and Bob is Cara's parent should let us infer that Ann is Cara's grandparent, even if that exact pair was not memorized. A table-based learner can store examples, but it does not naturally invent the two-hop rule.</p>
    <p>ILP treats learning as rule search. Candidate clauses compete by <b>coverage</b>: a good rule covers many positive examples and few negative examples. The mental model is a detective comparing explanations. A rule that explains every true case but also explains every false case is too broad; a rule that explains no false cases but misses the positives is too narrow.</p>
    <p>The design decision people gloss over is the use of <b>negative examples</b>. Positives alone reward broad rules such as "anything is related to anything." Negatives are what carve away those lazy explanations and force the learned rule to have the right shape.</p>`,
  mathematics: String.raw`
    <p>Let $P$ be the set of positive atoms, $N$ the set of negative atoms, and $r$ a candidate rule. Its positive and negative coverage are</p>
    <div class="formula-box">$$cov^+(r)=|\\{e\\in P:r\\models e\\}|,\\qquad cov^-(r)=|\\{e\\in N:r\\models e\\}|.$$</div>
    <p>The notebook uses a tiny score $score(r)=cov^+(r)-cov^-(r)$, where $r\\models e$ means the rule proves example $e$ from the facts.</p>

    <p><b>The relational facts.</b> The known parent facts are $(ann,bob)$, $(bob,cara)$, and $(cara,dan)$. The positive grandparent examples are $(ann,cara)$ and $(bob,dan)$:</p>
    <ol class="work">
      <li>$(ann,cara)$: $parent(ann,bob)=1$ and $parent(bob,cara)=1$, so the two-hop rule proves it.</li>
      <li>$(bob,dan)$: $parent(bob,cara)=1$ and $parent(cara,dan)=1$, so the two-hop rule proves it.</li>
      <li>candidate two-hop predictions among all 16 ordered pairs: exactly $\{(ann,cara),(bob,dan)\}$, so positive coverage is $2$.</li>
    </ol>
    <p>The rule is not memorizing names; it is using an intermediate variable $Y$ as the mechanism of transfer.</p>

    <p><b>Candidate rule coverage.</b> Compare three candidate rules against positives $P=\{(ann,cara),(bob,dan)\}$ and negatives $N=\{(ann,dan),(bob,cara),(cara,ann)\}$:</p>
    <ol class="work">
      <li>$parent(X,Z)$: covers $0$ positives and $1$ negative, so score $=0-1=-1$</li>
      <li>$parent2(X,Z)$: covers $2$ positives and $0$ negatives, so score $=2-0=2$</li>
      <li>$anything(X,Z)$ with $X\\ne Z$: covers $2$ positives and $3$ negatives, so score $=2-3=-1$</li>
    </ol>
    <p>The overbroad rule looks good if you only count positives, but the negative coverage exposes it immediately.</p>

    <p><b>Version-space shrinkage.</b> Count how many of the three candidates remain consistent as examples are added:</p>
    <ol class="work">
      <li>with $1$ positive and $0$ negatives: $2$ candidates remain</li>
      <li>with $1$ positive and $1$ negative: $2$ candidates remain</li>
      <li>with $1$ positive and $3$ negatives: $1$ candidate remains</li>
      <li>with $2$ positives and $0$ negatives: $2$ candidates remain</li>
      <li>with $2$ positives and $1$ negative: $2$ candidates remain</li>
      <li>with $2$ positives and $3$ negatives: $1$ candidate remains</li>
    </ol>
    <p>The final survivor is the two-hop parent rule. The arithmetic is small, but the lesson is large: examples do not just train a parameter; they prune a symbolic hypothesis space.</p>

    <p><b>Generalization through a learned rule.</b> Before adding the fact $(bob,dan)$, the learned two-hop rule cannot prove $(ann,dan)$:</p>
    <ol class="work">
      <li>before: no $Y$ has both $parent(ann,Y)$ and $parent(Y,dan)$, so prediction $=0$</li>
      <li>after adding $parent(bob,dan)$: choose $Y=bob$, and both $parent(ann,bob)$ and $parent(bob,dan)$ are true, so prediction $=1$</li>
    </ol>
    <p>This is why ILP can feel powerful on small data: once the rule is right, new facts are absorbed by reasoning rather than retraining.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Learning from positives only.</b> The term $cov^-(r)$ is what rejects the overbroad $anything(X,Z)$ rule; without it, coverage rewards trivial rules.</li>
      <li><b>Letting the search language grow without bias.</b> More predicates and longer clauses expand the candidate set combinatorially, so the version-space pruning becomes expensive.</li>
      <li><b>Confusing a proved atom with a true atom.</b> $r\\models e$ means the rule and current facts entail $e$; missing facts can make a true relation unprovable.</li>
      <li><b>Ignoring variable binding.</b> The power of $parent(X,Y)\\wedge parent(Y,Z)$ is the shared $Y$; if the variables are not bound consistently, the clause changes meaning.</li>
    </ul>`
};

/* ---------------- 25.3 Differentiable programming ---------------- */
window.ALLML_CONTENT["25.3"] = {
  tagline: "Differentiable programming writes a model as ordinary code, then chooses smooth pieces so gradients can tune it.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/25.3-differentiable-programming.ipynb",
  context: String.raw`
    <p>Differentiable programming is less a new model family than a new way to think about models.</p>
    <ul>
      <li><b>Backpropagation</b> supplies the chain-rule machinery that moves gradients through a computation graph.</li>
      <li><b>Optimization</b> supplies the update rule that changes parameters in the direction that lowers loss.</li>
      <li><b>Neurosymbolic integration (25.1)</b> uses the same trick when it replaces hard logic with smooth satisfaction functions.</li>
    </ul>
    <p>Where it leads: differentiable programming makes program synthesis (25.4) less purely discrete, supports neural theorem proving (25.5), and underlies modern systems where simulators, renderers, planners, or logic layers become trainable components.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that useful programs often contain decisions: thresholds, branches, loops, and constraints. A hard branch is clear to a human, but it is hostile to gradients. If a tiny parameter change does not change the branch output, the optimizer sees no slope and has no instruction for improvement.</p>
    <p>Differentiable programming keeps the program-like structure but replaces brittle operations with smooth relaxations where needed. A hard threshold becomes a sigmoid; a hard choice becomes a soft weighting; a discrete loss becomes a smooth surrogate. The mental model is sanding the corners off a program so gradient descent can slide along it.</p>
    <p>The design decision people gloss over is that the relaxation is a <b>modeling choice</b>, not a free lunch. Smoothness gives learnability, but it may change the meaning of the original program. The art is to make the relaxed program close enough to the intended computation while still giving gradients a useful path.</p>`,
  mathematics: String.raw`
    <p>Let $x\\in\\mathbb{R}^m$ be inputs, $y\\in\\{0,1\\}^m$ labels, $t\\in\\mathbb{R}$ a program parameter, and $k\\gt0$ a sharpness constant. A differentiable threshold program is</p>
    <div class="formula-box">$$\\hat y_i(t)=\\sigma(k(x_i-t)),\\qquad \\sigma(z)=\\frac{1}{1+e^{-z}}.$$</div>
    <p>We train $t$ by minimizing binary cross-entropy $L(t)=\\frac1m\\sum_i BCE(\\hat y_i(t),y_i)$.</p>

    <p><b>A smooth threshold.</b> For $x=\{0,1,2,3\}$, $y=\{0,0,1,1\}$, $k=4$, and $t=1.5$:</p>
    <ol class="work">
      <li>predictions: $\\sigma(4(x-t))=\{0.0024726231566347743,0.11920292202211755,0.8807970779778823,0.9975273768433653\}$</li>
      <li>BCE mean: $0.06470184809035148$</li>
    </ol>
    <p>The outputs are almost binary but not exactly binary, which is precisely why the parameter still has a gradient.</p>

    <p><b>The loss surface over $t$.</b> Sweeping $t$ from $0$ to $3$ in steps of $0.025$ gives a minimum at $t=1.5$:</p>
    <ol class="work">
      <li>$L(1.0)=0.41003759580145864$</li>
      <li>$L(1.5)=0.06470184809035148$</li>
      <li>$L(2.0)=0.41003759580145864$</li>
    </ol>
    <p>The symmetry is expected: the labels change between $1$ and $2$, so the best threshold sits halfway between them.</p>

    <p><b>A finite-difference gradient.</b> At $t=1.0$ with $\\epsilon=0.0001$:</p>
    <ol class="work">
      <li>$L(t+\\epsilon)=L(1.0001)=0.4099636350105602$</li>
      <li>$L(t-\\epsilon)=L(0.9999)=0.4100635679407319$</li>
      <li>$\\frac{L(t+\\epsilon)-L(t-\\epsilon)}{2\\epsilon}=\\frac{0.4099636350105602-0.4100635679407319}{0.0002}=-0.49966464986062054$</li>
    </ol>
    <p>The negative sign says increasing $t$ lowers the loss, so gradient descent moves the program threshold to the right.</p>

    <p><b>Gradient descent on a program parameter.</b> Starting at $t=1.0$ and updating $t\\leftarrow t-0.2\\nabla L(t)$ for 30 steps:</p>
    <ol class="work">
      <li>step 0: $t=1.0$, $L=0.41003759580145864$</li>
      <li>after 30 updates: $t=1.4984574318643302$</li>
      <li>final loss at that value: $0.06470660792442283$</li>
    </ol>
    <p>The learned value nearly reaches the hand-derived optimum, showing that the program's parameter became something an optimizer could tune.</p>

    <p><b>Why not a hard branch?</b> The hard loss $\\frac1m\\sum_i(\\mathbf{1}[x_i\\gt t]-y_i)^2$ is flat over intervals:</p>
    <ol class="work">
      <li>between $t=1.01$ and $t=1.99$, the hard predictions remain $\{0,0,1,1\}$ and loss stays $0$</li>
      <li>the soft loss changes continuously over the same region, exposing many distinct values for the optimizer</li>
    </ol>
    <p>Flat regions are not always bad for evaluation, but they are poor teachers for gradient-based learning.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Assuming differentiable means faithful.</b> The sigmoid program approximates a threshold, but the sharpness $k$ changes both the meaning and the gradient scale.</li>
      <li><b>Making the relaxation too sharp too early.</b> Large $k$ makes $\\sigma(k(x-t))$ nearly binary, which can saturate gradients and recreate the hard-branch problem.</li>
      <li><b>Trusting finite differences blindly.</b> The estimate uses $\\epsilon$; too large blurs curvature, while too small can be dominated by floating-point error.</li>
      <li><b>Forgetting non-smooth pieces in the middle.</b> One hard argmax or comparison can block gradient flow even if the rest of the program is smooth.</li>
    </ul>`
};

/* ---------------- 25.4 Program synthesis ---------------- */
window.ALLML_CONTENT["25.4"] = {
  tagline: "Program synthesis searches a language of possible programs until one matches the behavior we asked for.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/25.4-program-synthesis.ipynb",
  context: String.raw`
    <p>Program synthesis asks for a stronger output than a prediction: it asks for code.</p>
    <ul>
      <li><b>Inductive logic programming (25.2)</b> searched over logical clauses; program synthesis generalizes that idea to a broader language of candidate programs.</li>
      <li><b>Optimization</b> contributes the scoring view: every program receives a loss on the examples.</li>
      <li><b>Differentiable programming (25.3)</b> offers one way to soften parts of the search, but this lesson studies the clean discrete version first.</li>
    </ul>
    <p>Where it leads: synthesis ideas appear in code generation, data-wrangling automation, theorem proving, and neural-guided search. The same ambiguity problem also explains why later systems need constraints, tests, and search priors.</p>`,
  intuition: String.raw`
    <p>The concrete problem is turning examples into an executable rule. If the examples say $0\\mapsto1$, $-2\\mapsto5$, and $2\\mapsto5$, we want the system to discover something like $x^2+1$, not merely memorize a lookup table.</p>
    <p>The naive approach is to enumerate every possible program and test it. That works in the toy notebook because the language is tiny, but real languages explode combinatorially. The mental model is searching a maze: examples act like gates that close off inconsistent paths, and a loss function ranks near misses when exact matches are rare.</p>
    <p>The design decision people gloss over is the choice of <b>program language</b>. Search is only possible because we restrict the grammar. If the right program is outside the language, synthesis cannot find it; if the language is too broad, search drowns in possibilities. The grammar is the bias-complexity tradeoff of program synthesis.</p>`,
  mathematics: String.raw`
    <p>Let $\\mathcal{P}$ be a finite set of candidate programs, $D=\\{(x_i,y_i)\\}_{i=1}^{m}$ input-output examples, and $p(x)$ the output of program $p$. A simple synthesis score is mean squared error:</p>
    <div class="formula-box">$$L(p)=\\frac1m\\sum_{i=1}^{m}(p(x_i)-y_i)^2,\\qquad \\hat p=\\arg\\min_{p\\in\\mathcal{P}}L(p).$$</div>
    <p>The notebook language contains programs $x+c$, $c\\cdot x$, and $x^2+c$ for $c\\in\{-2,-1,0,1,2\}$.</p>

    <p><b>Scoring candidate programs.</b> Use examples $x=\{0,-2,-1,1,2\}$ and $y=x^2+1=\{1,5,2,2,5\}$:</p>
    <ol class="work">
      <li>$p(x)=x^2+1$: errors $\{0,0,0,0,0\}$, MSE $=0/5=0$</li>
      <li>$p(x)=x^2+0$: errors $\{-1,-1,-1,-1,-1\}$, squared errors sum $=5$, MSE $=1.0$</li>
      <li>$p(x)=x^2+2$: errors $\{1,1,1,1,1\}$, squared errors sum $=5$, MSE $=1.0$</li>
      <li>$p(x)=x+2$: predictions $\{2,0,1,3,4\}$, squared errors $\{1,25,1,1,1\}$, MSE $=29/5=5.8$</li>
    </ol>
    <p>The exact program wins, and the nearest misses are the same shape with the wrong constant.</p>

    <p><b>Version-space pruning.</b> Count programs that exactly match the first $m$ examples:</p>
    <ol class="work">
      <li>$m=1$: $2$ programs fit the example $0\\mapsto1$</li>
      <li>$m=2$: $1$ program fits both $0\\mapsto1$ and $-2\\mapsto5$</li>
      <li>$m=3$: $1$ program remains</li>
      <li>$m=4$: $1$ program remains</li>
      <li>$m=5$: $1$ program remains</li>
    </ol>
    <p>The second example is decisive in this tiny language because it distinguishes the linear alias $x+1$ from the quadratic rule $x^2+1$.</p>

    <p><b>Ambiguity from too few examples.</b> With only $0\\mapsto1$:</p>
    <ol class="work">
      <li>$x+1$ gives $0+1=1$, so it fits.</li>
      <li>$x^2+1$ gives $0^2+1=1$, so it also fits.</li>
      <li>both have zero loss on the single example, so no data-driven score can prefer the intended one yet.</li>
    </ol>
    <p>This is why synthesized code must be tested beyond the examples used to create it; a wrong program can be perfectly consistent with a weak specification.</p>

    <p><b>Held-out behavior.</b> The selected program $x^2+1$ is tested on $x=\{3,4\}$:</p>
    <ol class="work">
      <li>$3^2+1=9+1=10$</li>
      <li>$4^2+1=16+1=17$</li>
    </ol>
    <p>The held-out match is not magic; it is the reward for finding the right program structure rather than a table of observed outputs.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Underspecified examples.</b> The set $\{0\\mapsto1\}$ cannot distinguish $x+1$ from $x^2+1$, so exact training fit is not enough.</li>
      <li><b>Grammar bias hiding the answer.</b> If $x^2+c$ is absent from $\\mathcal{P}$, the true program has no chance to be found regardless of the search algorithm.</li>
      <li><b>Search explosion.</b> Adding constants, operators, branches, and composition grows $|\\mathcal{P}|$ rapidly; enumeration stops being practical.</li>
      <li><b>Ranking near misses as if they were correct.</b> Low MSE can identify a useful neighbor, but a program with small numerical error may violate the required semantics.</li>
    </ul>`
};

/* ---------------- 25.5 Neural theorem proving ---------------- */
window.ALLML_CONTENT["25.5"] = {
  tagline: "Neural theorem proving keeps proof structure, but replaces exact symbol matching with soft unification.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/25.5-neural-theorem-proving.ipynb",
  context: String.raw`
    <p>Neural theorem proving sits at the far end of the neurosymbolic path.</p>
    <ul>
      <li><b>Classical theorem proving</b> supplies proof search: facts and rules combine to derive a query.</li>
      <li><b>Embeddings</b> supply graded similarity, so related symbols can partially match instead of failing exactly.</li>
      <li><b>Differentiable programming (25.3)</b> supplies the smooth scoring machinery that lets proof confidence depend on learnable vectors and rule weights.</li>
    </ul>
    <p>Where it leads: neural theorem proving connects rule learning, retrieval, knowledge graphs, and differentiable reasoning. It also exposes the central risk of soft logic: useful generalization and false analogies are produced by the same similarity mechanism.</p>`,
  intuition: String.raw`
    <p>The concrete problem is brittleness in symbolic proof. Exact unification says two symbols either match or they do not. That is clean when the knowledge base is complete and names are canonical, but real data has aliases, missing facts, near-synonyms, and uncertain relations.</p>
    <p>Neural theorem proving keeps the skeleton of proof search but softens the matching step. Instead of asking "are these symbols identical?" it asks "how similar are their embeddings?" A proof path then receives a score from fact confidence, rule confidence, and unification confidence. The mental model is a proof tree whose branches have weights rather than yes-or-no switches.</p>
    <p>The design decision people gloss over is how to combine paths. A theorem may be supported by several weak proofs, one strong proof, or many misleading near matches. The aggregation rule, temperature, and embedding geometry decide whether soft reasoning is cautious or gullible.</p>`,
  mathematics: String.raw`
    <p>Let $e_a,e_b\\in\\mathbb{R}^d$ be normalized embeddings for two symbols. A soft unification score is cosine similarity</p>
    <div class="formula-box">$$u(a,b)=e_a^\\top e_b.$$</div>
    <p>For one proof path with fact confidence $f$, unification score $u$, and rule confidence $r$, the path score is</p>
    <div class="formula-box">$$s_{path}=f\\cdot u\\cdot r.$$</div>
    <p>Multiple proof paths can be combined with a soft OR:</p>
    <div class="formula-box">$$S=1-\\prod_j(1-s_j).$$</div>

    <p><b>Soft unification.</b> Use normalized embeddings $alice=(1,0)$, $bob=(0.9701425001453318,0.24253562503633294)$, and $carol=(0,1)$:</p>
    <ol class="work">
      <li>$u(alice,alice)=1\\cdot1+0\\cdot0=1.0$</li>
      <li>$u(alice,bob)=1\\cdot0.9701425001453318+0\\cdot0.24253562503633294=0.9701425001453318$</li>
      <li>$u(alice,carol)=1\\cdot0+0\\cdot1=0.0$</li>
    </ol>
    <p>A classical prover would match only the first case; the neural prover can give Bob a high but not perfect match to Alice.</p>

    <p><b>One proof path.</b> With fact confidence $0.9$, unification $0.9701425001453318$, and rule confidence $0.8$:</p>
    <ol class="work">
      <li>$0.9\\cdot0.9701425001453318=0.8731282501307987$</li>
      <li>$0.8731282501307987\\cdot0.8=0.6985026001046389$</li>
    </ol>
    <p>The path is strong, but each uncertain component lowers the final proof score. This multiplicative form is intentionally conservative.</p>

    <p><b>Temperature in proof attention.</b> With similarities $\{1.0,0.9701425001453318,0.0\}$, softmax weights are computed as $\\exp(sim/\\tau)$ divided by the sum:</p>
    <ol class="work">
      <li>$\\tau=0.2$: weights $\{0.5359210030511573,0.4614037595663572,0.002675237382485479\}$</li>
      <li>$\\tau=0.5$: weights $\{0.4739434710247303,0.44643847071117955,0.0796180582640902\}$</li>
      <li>$\\tau=1.0$: weights $\{0.4272237377129011,0.4146640672406524,0.15811219504644652\}$</li>
    </ol>
    <p>Lower temperature concentrates proof mass on the closest symbols; higher temperature lets weaker analogies participate.</p>

    <p><b>Combining proof paths.</b> For path scores $\{0.6985026001046389,0.25,0.10\}$:</p>
    <ol class="work">
      <li>failure probabilities: $\{1-0.6985026001046389,1-0.25,1-0.10\}=\{0.3014973998953611,0.75,0.9\}$</li>
      <li>all-fail product: $0.3014973998953611\\cdot0.75\\cdot0.9=0.20351074492936872$</li>
      <li>soft OR score: $1-0.20351074492936872=0.7964892550706313$</li>
    </ol>
    <p>The combined theorem score is higher than any weak path alone but still bounded by the uncertainty of the evidence.</p>

    <p><b>A learned rule weight.</b> If one path contributes $0.9\\cdot0.9701425001453318=0.8731282501307987$ before multiplying by a rule weight $w$, and two auxiliary paths contribute $0.25w$ and $0.10w$, then:</p>
    <ol class="work">
      <li>$w=0$: theorem score $=0$</li>
      <li>$w=0.5$: $1-(1-0.43656412506539934)(1-0.125)(1-0.05)=0.5315860376728629$</li>
      <li>$w=1$: $1-(1-0.8731282501307987)(1-0.25)(1-0.10)=0.9143615688372891$</li>
    </ol>
    <p>The satisfaction curve is smooth, so a learning algorithm can increase the rule weight when successful proofs should become more confident.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Over-trusting embedding similarity.</b> The term $u(a,b)=e_a^\\top e_b$ can make aliases useful, but it can also prove facts through accidental nearest neighbors.</li>
      <li><b>Temperature too high.</b> In the softmax weights, large $\\tau$ gives weak symbols more mass, which can create diffuse and misleading proof support.</li>
      <li><b>Multiplying many uncertain terms.</b> The path score $f\\cdot u\\cdot r$ shrinks quickly with proof length, so long valid proofs may be under-scored.</li>
      <li><b>Combining dependent paths as independent.</b> The soft OR $1-\\prod_j(1-s_j)$ assumes path failures combine cleanly; shared facts can make the combined score overconfident.</li>
    </ul>`
};
