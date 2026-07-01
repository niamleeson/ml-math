/* All ML — Part 25 applications (5 each). Loaded after content-part-25.js, before all-ml-register.js. */

/* ---- _apps-part25-A.js ---- */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

(window.ALLML_CONTENT["25.1"] = window.ALLML_CONTENT["25.1"] || {}).applications = [
  {
    title: "Medical decision support with incompatible diagnoses",
    background: "<p>Clinical decision-support systems often combine model scores with physician-authored constraints, because some conditions or treatments should not be simultaneously recommended without explicit evidence.</p>",
    numbers: "<p>Using the lesson implication $A\\Rightarrow B=\\max(1-A,B)$ with illustrative $A=0.9$ and $B=0.4$, satisfaction is $\\max(0.1,0.4)=0.4$ and the penalty is $1-0.4=0.6$.</p>"
  },
  {
    title: "Scene-graph consistency for perception systems",
    background: "<p>Robotics and vision systems use scene graphs to keep object relations such as inside, outside, support, or containment consistent with perception scores.</p>",
    numbers: "<p>For illustrative inside and outside scores $0.70$ and $0.60$, product AND gives joint violation evidence $0.70\\cdot0.60=0.42$.</p>"
  },
  {
    title: "Recommender business-rule regularization",
    background: "<p>Recommenders often optimize click or conversion predictions while also respecting eligibility, policy, and marketplace constraints written as business rules.</p>",
    numbers: "<p>With lesson $L_{neural}=0.22839300363692283$, penalty $0.4$, and $\\lambda=2$, total loss is $0.22839300363692283+2\\cdot0.4=1.0283930036369228$.</p>"
  },
  {
    title: "Knowledge-graph completion with type constraints",
    background: "<p>Knowledge-graph completion models use neural scores for missing edges, but symbolic type constraints prevent implausible completions from receiving unchecked probability.</p>",
    numbers: "<p>For two illustrative type signals $0.70$ and $0.60$, probabilistic OR gives $0.70+0.60-0.70\\cdot0.60=0.88$ satisfaction.</p>"
  },
  {
    title: "Safety filtering for robotics actions",
    background: "<p>Safety-aware robot policies can train on rewards while adding differentiable penalties for unsafe states or forbidden action combinations.</p>",
    numbers: "<p>Holding the lesson neural loss and penalty fixed, increasing $\\lambda$ from $0.5$ to $5$ changes total loss from $0.22839300363692283+0.5\\cdot0.4=0.42839300363692284$ to $0.22839300363692283+5\\cdot0.4=2.228393003636923$.</p>"
  }
];

(window.ALLML_CONTENT["25.2"] = window.ALLML_CONTENT["25.2"] || {}).applications = [
  {
    title: "Family and kinship rule learning",
    background: "<p>ILP was historically attractive for kinship domains because facts such as parent links naturally compose into readable clauses.</p>",
    numbers: "<p>The two-hop grandparent rule covers $2$ positives, covers $0$ negatives, and therefore scores $cov^+-cov^-=2-0=2$.</p>"
  },
  {
    title: "Biomedical relation discovery",
    background: "<p>Biomedical knowledge bases use relational rules to propose interactions, while counterexamples help prevent broad rules from becoming misleading.</p>",
    numbers: "<p>With illustrative support $cov^+=8$ and counterexamples $cov^-=3$, the rule score is $8-3=5$.</p>"
  },
  {
    title: "Fraud-ring relational rules",
    background: "<p>Fraud analysts look for relational motifs such as shared address, shared payment method, or repeated device identifiers across accounts.</p>",
    numbers: "<p>An illustrative shared-address rule covering $12$ positives and $5$ negatives scores $12-5=7$; positives-only scoring would hide the $5$ false alarms.</p>"
  },
  {
    title: "Access-control policy mining",
    background: "<p>Organizations can mine readable access rules from approved and denied access logs before turning them into auditable policy clauses.</p>",
    numbers: "<p>An illustrative clause covering $20$ approved accesses and $2$ denied accesses has score $20-2=18$.</p>"
  },
  {
    title: "Knowledge-base completion",
    background: "<p>Once a relational rule is learned, adding a new fact can unlock new entailed facts without retraining a statistical model.</p>",
    numbers: "<p>Before adding $parent(bob,dan)$, $grandparent(ann,dan)$ is unproved, so the value is $0$; after adding it, choose $Y=bob$ and the two-hop rule proves the atom, so the value is $1$.</p>"
  }
];

(window.ALLML_CONTENT["25.3"] = window.ALLML_CONTENT["25.3"] || {}).applications = [
  {
    title: "Trainable thresholding in risk triage",
    background: "<p>Risk triage systems often begin as threshold programs, then replace hard cutoffs with smooth versions so the cutoff can be tuned by gradients.</p>",
    numbers: "<p>For $t=1.5$ and $k=4$, the lesson program $\\sigma(k(x-t))$ on $x=\\{0,1,2,3\\}$ gives $\\{0.0024726231566347743,0.11920292202211755,0.8807970779778823,0.9975273768433653\\}$.</p>"
  },
  {
    title: "Differentiable simulators for robotics",
    background: "<p>Smooth contact and collision approximations let robot controllers tune simulator parameters instead of treating the simulator as a black box.</p>",
    numbers: "<p>The lesson finite difference at $t=1.0$ is $\\frac{L(1.0001)-L(0.9999)}{0.0002}=-0.49966464986062054$, so increasing $t$ lowers loss.</p>"
  },
  {
    title: "Soft routing in decision pipelines",
    background: "<p>Production decision pipelines use branches, but training often needs a soft surrogate because a hard branch can be flat over wide parameter intervals.</p>",
    numbers: "<p>The lesson hard branch has loss $0$ throughout $t\\in[1.01,1.99]$, showing no gradient signal even though the soft loss still changes continuously.</p>"
  },
  {
    title: "Differentiable rendering and calibration",
    background: "<p>Rendering and calibration systems can expose camera, lighting, or threshold parameters to gradient descent when their operations are smoothed.</p>",
    numbers: "<p>Starting from $t=1.0$, the lesson gradient descent update reaches $t=1.4984574318643302$ after $30$ updates.</p>"
  },
  {
    title: "Constraint layers in optimization models",
    background: "<p>Differentiable constraint layers turn feasibility preferences into losses that optimizers can trade against data fit.</p>",
    numbers: "<p>The lesson loss surface has $L(1.0)=0.41003759580145864$, $L(1.5)=0.06470184809035148$, and $L(2.0)=0.41003759580145864$, so the smooth optimum is centered at $1.5$.</p>"
  }
];

(window.ALLML_CONTENT["25.4"] = window.ALLML_CONTENT["25.4"] || {}).applications = [
  {
    title: "Spreadsheet and data-wrangling synthesis",
    background: "<p>Spreadsheet synthesis tools infer formulas or transformations from a few examples, reducing repetitive manual cleaning work.</p>",
    numbers: "<p>In the lesson grammar, $x^2+1$ has errors $\\{0,0,0,0,0\\}$ on $5$ examples, so its MSE is $0/5=0$.</p>"
  },
  {
    title: "Code generation from tests",
    background: "<p>Test-driven code generation is a synthesis problem: candidate programs are accepted or rejected by behavioral examples.</p>",
    numbers: "<p>With only the example $0\\mapsto1$, the lesson has $2$ zero-loss programs, so the specification is underspecified.</p>"
  },
  {
    title: "SQL query-by-example tools",
    background: "<p>Query-by-example systems search candidate queries and keep those whose outputs match user-provided tables.</p>",
    numbers: "<p>An illustrative candidate with $0$ mismatches over $6$ examples beats a candidate with $2/6$ mismatches, because its empirical error is $0$ instead of $0.3333333333333333$.</p>"
  },
  {
    title: "Robotics task-program synthesis",
    background: "<p>Robotics planners synthesize compact task programs, but adding branches rapidly expands the language of possible plans.</p>",
    numbers: "<p>The lesson-style arithmetic grammar has $3$ templates times $5$ constants, or $15$ programs; adding branch thresholds and alternatives can expand this into hundreds of candidates.</p>"
  },
  {
    title: "API transformation synthesis",
    background: "<p>API migration tools infer field transformations from examples and rank near misses when no candidate exactly matches all examples.</p>",
    numbers: "<p>The lesson near misses $x^2+0$ and $x^2+2$ each have MSE $1.0$, while $x+2$ has MSE $5.8$, so shape-correct programs are much closer.</p>"
  }
];

(window.ALLML_CONTENT["25.5"] = window.ALLML_CONTENT["25.5"] || {}).applications = [
  {
    title: "Knowledge-graph reasoning with aliases",
    background: "<p>Knowledge graphs often contain aliases and spelling variants, so exact unification can miss useful proof paths.</p>",
    numbers: "<p>The lesson embeddings give $u(alice,bob)=0.9701425001453318$ instead of an exact-match failure, while $u(alice,carol)=0$.</p>"
  },
  {
    title: "Entity-resolution-assisted proof search",
    background: "<p>Entity resolution can feed theorem provers by allowing proof paths through high-confidence aliases rather than only identical names.</p>",
    numbers: "<p>With fact confidence $f=0.9$, unification $u=0.9701425001453318$, and rule confidence $r=0.8$, the path score is $0.9\\cdot0.9701425001453318\\cdot0.8=0.6985026001046389$.</p>"
  },
  {
    title: "Biomedical theorem and protein-link reasoning",
    background: "<p>Biomedical relation graphs often contain multiple weak paths between proteins, diseases, and mechanisms; soft OR aggregates those supports.</p>",
    numbers: "<p>For illustrative path supports $0.60$ and $0.20$, soft OR gives $1-(1-0.60)(1-0.20)=1-0.40\\cdot0.80=0.68$.</p>"
  },
  {
    title: "Legal and compliance rule retrieval",
    background: "<p>Compliance retrieval systems use soft matching to find relevant clauses, but high temperature can make weak analogies receive too much proof mass.</p>",
    numbers: "<p>At lesson temperature $\\tau=1.0$, the weak symbol receives softmax mass $0.15811219504644652$, illustrating diffuse support.</p>"
  },
  {
    title: "Rule-weight learning in differentiable reasoning",
    background: "<p>Differentiable proof scores let systems learn how much confidence to place in rules based on successful or failed proofs.</p>",
    numbers: "<p>The lesson theorem score rises from $0$ at $w=0$ to $0.9143615688372891$ at $w=1$, using $1-(1-0.8731282501307987)(1-0.25)(1-0.10)$.</p>"
  }
];

