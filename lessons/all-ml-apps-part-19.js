/* All ML — Part 19 applications (5 each). Loaded after content-part-19.js, before all-ml-register.js. */

/* ---- _apps-part19-A.js ---- */
/* All ML — Part 19A applications (5 each). Loaded after content-part-19.js, before all-ml-register.js. */

window.ALLML_CONTENT["19.1"].applications = [
  {
    title: "Credit underwriting receipts",
    background: "<p>Underwriters use local explanations to show which applicant facts moved a single approval score, rather than quoting only a global feature ranking.</p>",
    numbers: "<p>The lesson receipt has components $1.200$, $-0.400$, and $0.900$, so $f(x)-\phi_0=1.200-0.400+0.900=1.700$ and the leading share is $|1.200|/2.500=0.480$.</p>"
  },
  {
    title: "Medical triage audit load",
    background: "<p>Clinical triage teams need to separate factors that raise risk from factors that lower it because both kinds affect a human review.</p>",
    numbers: "<p>The absolute explanatory mass is $|1.200|+|-0.400|+|0.900|=2.500$, so even though the signed move is $1.700$, the audit workload covers $2.500$ units of mechanism.</p>"
  },
  {
    title: "Fraud review feature removal",
    background: "<p>Fraud analysts often ask whether a suspicious decision survives when one mechanism is unavailable or distrusted.</p>",
    numbers: "<p>Removing the third component gives $1.700-0.900=0.800$, so the score change is $0.800-1.700=-0.900$.</p>"
  },
  {
    title: "Ad quality ranking guardrails",
    background: "<p>Ranking systems can add a robustness or policy guard to raw model explanations before a release gate.</p>",
    numbers: "<p>With knob $0.300$, the guarded score is $1.700+0.300\cdot2.500=2.450$, a relative guard of $(2.450-1.700)/|1.700|=0.441$.</p>"
  },
  {
    title: "Hiring-screen signed attributions",
    background: "<p>Hiring audits should preserve signed contributions because a factor that helps one candidate can harm another even if its absolute rank is high.</p>",
    numbers: "<p>The signed receipt $\{1.200,-0.400,0.900\}$ sums to $1.700$; sorting only by $\{|1.200|,|0.400|,|0.900|\}$ would hide the negative mechanism.</p>"
  }
];

window.ALLML_CONTENT["19.2"].applications = [
  {
    title: "Loan appeal explanations",
    background: "<p>A local surrogate helps explain one applicant near their own point instead of averaging unrelated applicants.</p>",
    numbers: "<p>The local components $0.800$, $0.200$, and $-0.100$ sum to $0.900$, with absolute mass $1.100$ and top share $0.800/1.100=0.727$.</p>"
  },
  {
    title: "Skin-image saliency review",
    background: "<p>Image auditors inspect saliency maps to see which pixels the score is most sensitive to before trusting a visual classifier.</p>",
    numbers: "<p>On an illustrative $8\times8$ image rung there are $64$ pixel features; saliency ranks the entries of $\nabla f(x)$ before deletion checks test whether the highlighted pixels matter.</p>"
  },
  {
    title: "Content moderation kernel sweeps",
    background: "<p>Moderation teams sweep LIME kernel width because a too-wide neighborhood stops being local.</p>",
    numbers: "<p>The lesson guard uses knob $0.500$: $0.900+0.500\cdot1.100=1.450$, so the guarded local score rises by $0.550$.</p>"
  },
  {
    title: "Fraud analyst perturbation budget",
    background: "<p>Fraud tools need enough perturbations to make local coefficients stable under the weighted least-squares fit.</p>",
    numbers: "<p>The absolute local mass $|0.800|+|0.200|+|-0.100|=1.100$ is the budget whose allocation should remain stable when perturbation count increases.</p>"
  },
  {
    title: "Claims triage mechanism removal",
    background: "<p>Claims reviewers can ask whether a disputed local factor changes the decision story when removed.</p>",
    numbers: "<p>Removing the third component gives $0.900-(-0.100)=1.000$, so the score moves by $1.000-0.900=0.100$.</p>"
  }
];

window.ALLML_CONTENT["19.3"].applications = [
  {
    title: "Credit denial recourse",
    background: "<p>Counterfactual recourse turns a denial into the smallest actionable change that would cross the model threshold.</p>",
    numbers: "<p>The toy counterfactual cost decomposes as $0.600+0.300+0.100=1.000$, and the largest action consumes $0.600/1.000=0.600$ of the budget.</p>"
  },
  {
    title: "Admissions advising constraints",
    background: "<p>Advising systems must distinguish mutable actions from immutable facts so the recommendation is possible for the applicant.</p>",
    numbers: "<p>An illustrative audit with $2$ mutable features and $1$ immutable feature should allow edits only on the mutable mask while still meeting the total distance budget $1.000$.</p>"
  },
  {
    title: "Churn intervention planning",
    background: "<p>Retention teams compare the nearest acceptable region with the raw probability so an intervention can be costed.</p>",
    numbers: "<p>With guard knob $0.400$, the trustworthy recourse score is $1.000+0.400\cdot1.000=1.400$.</p>"
  },
  {
    title: "Medical risk counseling",
    background: "<p>Risk counseling uses feature-scaled costs so dollars, years, lab values, and binary flags are not mixed unfairly.</p>",
    numbers: "<p>The lesson distance budget is $1.000$; scaled terms $0.600$, $0.300$, and $0.100$ make the total re-derivable as $1.000$.</p>"
  },
  {
    title: "Fraud challenge workflow",
    background: "<p>When users challenge a model decision, teams test whether the proposed recourse is stable under mechanism removal.</p>",
    numbers: "<p>Removing mechanism three changes the cost from $1.000$ to $0.900$, so the change is $0.900-1.000=-0.100$.</p>"
  }
];

window.ALLML_CONTENT["19.4"].applications = [
  {
    title: "Medical imaging concepts",
    background: "<p>Concept directions let clinicians ask whether a human-visible pattern tends to raise a disease score in activation space.</p>",
    numbers: "<p>The toy TCAV components are $0.700$, $0.400$, and $-0.200$, so $S_{C,k}=0.700+0.400-0.200=0.900$.</p>"
  },
  {
    title: "Brand-safety classifier audit",
    background: "<p>Brand-safety teams compare concept sensitivity with controls before treating a concept as release evidence.</p>",
    numbers: "<p>The absolute concept mass is $|0.700|+|0.400|+|-0.200|=1.300$, and the top concept component share is $0.700/1.300=0.538$.</p>"
  },
  {
    title: "Hiring-text concept checks",
    background: "<p>Text audits can compare concept examples to random controls, while guarding against concept examples that are secretly class labels.</p>",
    numbers: "<p>With knob $0.600$, the guarded concept score is $0.900+0.600\cdot1.300=1.680$.</p>"
  },
  {
    title: "Digit model stroke concepts",
    background: "<p>Small image models can use concepts such as stroke thickness or loops as human-readable directions in an activation vector.</p>",
    numbers: "<p>An illustrative $8\times8$ digit activation has $64$ entries, and TCAV tests the dot product $\nabla h_k(x)^\top v_C$ along the chosen concept direction.</p>"
  },
  {
    title: "Visual search ranking",
    background: "<p>Search ranking audits use concept removal to see whether a direction is doing helpful ranking work or spurious work.</p>",
    numbers: "<p>Removing the third mechanism gives $0.900-(-0.200)=1.100$, so the score change is $1.100-0.900=0.200$.</p>"
  }
];

window.ALLML_CONTENT["19.5"].applications = [
  {
    title: "Bad-training-example debugging",
    background: "<p>Influence functions rank training points by their approximate effect on one audited prediction, helping decide what to inspect first.</p>",
    numbers: "<p>The toy influences $0.500$, $-0.700$, and $0.200$ have signed total $0.000$ but absolute mass $|0.500|+|-0.700|+|0.200|=1.400$.</p>"
  },
  {
    title: "Rare-case data audit",
    background: "<p>A high-influence point can be a clean rare case, so influence ranking is a triage signal rather than proof of bad data.</p>",
    numbers: "<p>The first component share is $|0.500|/1.400=0.357$, while the largest absolute component is $0.700/1.400=0.500$ for the negative influence.</p>"
  },
  {
    title: "Unlearning triage",
    background: "<p>Teams can estimate which candidate deletions may require expensive retraining before promising machine-unlearning guarantees.</p>",
    numbers: "<p>Removing mechanism three changes the toy total from $0.000$ to $-0.200$, so the change is $-0.200-0.000=-0.200$.</p>"
  },
  {
    title: "Label-noise inspection",
    background: "<p>Damping is essential because inverse Hessians can explode when curvature is near singular.</p>",
    numbers: "<p>An illustrative damping grid $\{0.01,0.10,1.00\}$ checks whether $I_i(z)=-\nabla\ell(z)^\top(H+\lambda I)^{-1}\nabla\ell(z_i)$ is stable.</p>"
  },
  {
    title: "Customer-support model audit",
    background: "<p>On small datasets, approximate influence should be checked against actual leave-one-out retraining before being operationalized.</p>",
    numbers: "<p>For an illustrative $20$-point toy audit, rank correlation between $20$ influence estimates and $20$ leave-one-out changes is the re-derivable faithfulness check.</p>"
  }
];

window.ALLML_CONTENT["19.6"].applications = [
  {
    title: "Loan approval monitoring",
    background: "<p>Demographic parity monitoring compares selection rates over all members of each group, matching harms about allocation volume.</p>",
    numbers: "<p>The lesson rates $0.650$ and $0.450$ give $\Delta_{DP}=|0.650-0.450|=0.200$.</p>"
  },
  {
    title: "Hiring model review",
    background: "<p>Equal opportunity focuses on qualified positives, so it uses a different denominator from demographic parity.</p>",
    numbers: "<p>An illustrative TPR gap of $0.100$ means $|P(\hat Y=1\mid Y=1,A=0)-P(\hat Y=1\mid Y=1,A=1)|=0.100$.</p>"
  },
  {
    title: "Recidivism risk audit",
    background: "<p>Equalized odds reports both true-positive-rate and false-positive-rate gaps because both missed positives and false alarms can create harm.</p>",
    numbers: "<p>If an illustrative dashboard has TPR gap $0.100$ and FPR gap $0.200$, the equalized-odds summary can be $\max(0.100,0.200)=0.200$.</p>"
  },
  {
    title: "Ad delivery pacing",
    background: "<p>Accuracy parity can hide who receives false positives or false negatives, so delivery systems track rate gaps directly.</p>",
    numbers: "<p>The lesson total is $0.650+0.450+0.200=1.300$ and the guarded fairness score is $1.300+0.200\cdot1.300=1.560$.</p>"
  },
  {
    title: "Healthcare prioritization",
    background: "<p>Fairness metrics must match the harm: access constraints often emphasize selection rates, while clinical misses emphasize TPR.</p>",
    numbers: "<p>The leading rate component share is $0.650/1.300=0.500$, so one rate accounts for half of the toy fairness receipt.</p>"
  }
];

/* ---- _apps-part19-B.js ---- */
window.ALLML_CONTENT["19.7"].applications = [
  {
    title: "Lending threshold post-processing",
    background: "<p>Credit models often keep the score fixed but adjust decision thresholds after auditing fairness. This is post-processing: it is easy to deploy, but it must be validated against accuracy and calibration.</p>",
    numbers: "<p>The lesson objective components are 0.350, 0.120, and 0.180, so the audit scale is $0.350+0.120+0.180=0.650$. A lender can re-derive every threshold objective from $J(\\theta)=R_S(\\theta)+\\lambda\\Delta(\\theta)$.</p>"
  },
  {
    title: "Hiring loss-constraint training",
    background: "<p>Hiring screeners may add a fairness penalty during training rather than changing thresholds afterward. The penalty makes subgroup disparity visible to the optimizer.</p>",
    numbers: "<p>With the lesson's lambda-like knob 0.500 and absolute mass 0.650, the guarded objective is $0.650+0.500\\cdot0.650=0.975$. That is the explicit price of the fairness guard.</p>"
  },
  {
    title: "Ad allocation reweighting",
    background: "<p>Ad allocation systems compare pre-processing, in-processing, and post-processing because biased exposure can enter through data, loss weighting, or thresholds.</p>",
    numbers: "<p>The largest lesson component contributes $|0.350|/0.650=0.538$ of the absolute audit mass. A concentrated 53.8% share warns that one mechanism dominates the mitigation story.</p>"
  },
  {
    title: "Benefits eligibility validation",
    background: "<p>Public-benefits eligibility models need fairness gains that survive sampling noise. Group-stratified validation avoids celebrating a lambda that only fits one accidental split.</p>",
    numbers: "<p>In an illustrative 5-fold group-stratified check, each fold recomputes $R_S+\\lambda\\Delta$. If the fold objectives cluster around 0.975 rather than only one lucky 0.650 base score, the mitigation is more credible.</p>"
  },
  {
    title: "Healthcare triage rare-cell weights",
    background: "<p>Healthcare triage audits often contain rare intersectional cells. Huge reweighting can reduce an apparent gap while exploding variance in the people least represented.</p>",
    numbers: "<p>The lesson absolute mass is 0.650, so rare-cell corrections larger than that scale deserve scrutiny. Removing mechanism three gives $0.650-0.180=0.470$, a change of $-0.180$.</p>"
  }
];

window.ALLML_CONTENT["19.8"].applications = [
  {
    title: "Image classifier safety",
    background: "<p>Safety teams use fast gradient sign attacks as a first red-team pass because they expose local decision-boundary fragility without expensive optimization.</p>",
    numbers: "<p>The lesson components sum to $0.400+0.300+0.200=0.900$. The FGSM step then adds $\\varepsilon\\operatorname{sign}(\\nabla_x\\ell)$, so the score must always be reported with the chosen $\\varepsilon$.</p>"
  },
  {
    title: "Fraud classifier probing",
    background: "<p>Fraud features are tabular, but small standardized edits can still move a model across a boundary. Robust accuracy is meaningful only with a declared perturbation radius.</p>",
    numbers: "<p>An illustrative epsilon ladder 0.00, 0.05, 0.10, 0.20, 0.30 shows whether the 0.900 clean-scale story collapses gradually or suddenly as $\\varepsilon$ grows.</p>"
  },
  {
    title: "Malware detection hardening",
    background: "<p>In malware detection, the norm defines which edits are allowed. Byte flips, feature toggles, and continuous feature shifts are different threat models.</p>",
    numbers: "<p>The leading lesson component share is $|0.400|/0.900=0.444$. If one feature family supplies 44.4% of the attack effect, hardening only that family may overfit the red team.</p>"
  },
  {
    title: "Autonomous perception QA",
    background: "<p>Perception QA often starts with small-norm image attacks, such as 8 by 8 digit perturbations, before moving to physical-world tests.</p>",
    numbers: "<p>At illustrative $\\varepsilon=0.10$, the guarded lesson score is $0.900+0.100\\cdot0.900=0.990$. The number is re-derivable, but semantic safety still needs separate review.</p>"
  },
  {
    title: "Content classifier red team",
    background: "<p>Content classifiers can be probed by changing harmless-looking features and measuring whether moderation boundaries move unexpectedly.</p>",
    numbers: "<p>Removing the third lesson mechanism changes the score by $0.700-0.900=-0.200$. That mirrors a red-team ablation: if one feature channel disappears, the attack report should show the new boundary behavior.</p>"
  }
];

window.ALLML_CONTENT["19.9"].applications = [
  {
    title: "Medical image release gates",
    background: "<p>Medical imaging release gates may require a proof that a diagnosis will not change under a specified perturbation radius. The proof does not apply outside that radius.</p>",
    numbers: "<p>The lesson margin components sum to $1.200+0.700+0.300=2.200$. A certificate then checks whether the class margin is larger than $2L\\varepsilon$.</p>"
  },
  {
    title: "Safety-critical perception",
    background: "<p>Robotics and vehicle perception teams use Lipschitz-style bounds to turn score margins into conservative robustness claims.</p>",
    numbers: "<p>The largest lesson margin share is $|1.200|/2.200=0.545$. If 54.5% of the proof margin comes from one mechanism, auditors should inspect how stable that mechanism is.</p>"
  },
  {
    title: "Fraud model assurance",
    background: "<p>Fraud assurance compares empirical attacks with certificates because passing one attack is not the same as proving no allowed attack exists.</p>",
    numbers: "<p>The lesson guard moves from 2.200 to $2.200+0.200\\cdot2.200=2.640$. That shows how a declared robustness knob changes the release threshold.</p>"
  },
  {
    title: "Document classifier QA",
    background: "<p>Document classifiers often have loose global bounds. A loose $L$ can fail to certify examples that are empirically robust.</p>",
    numbers: "<p>On an illustrative $L$ grid 0.5 to 5.0, the same radius $\\varepsilon$ changes the right side $2L\\varepsilon$ tenfold. A failed certificate may mean the bound is loose, not that the example is attackable.</p>"
  },
  {
    title: "Digit recognition demo",
    background: "<p>Small digit demos make the certificate concrete: each image is either certified at the stated radius or it is not.</p>",
    numbers: "<p>For an illustrative 8 by 8 D4 panel, one uncertified high-risk example has no proof even if the average certificate rate is high. Removing the third component gives $2.200-0.300=1.900$.</p>"
  }
];

window.ALLML_CONTENT["19.10"].applications = [
  {
    title: "Vision backdoor tests",
    background: "<p>Backdoor tests add a trigger at evaluation time and check conditional behavior, not just aggregate clean accuracy. This is a gap topic, so these examples follow the plan's stable numbers.</p>",
    numbers: "<p>The toy poison mix total is $0.050+0.400+0.120=0.570$. A clean-only report can hide high triggered risk inside that small aggregate.</p>"
  },
  {
    title: "Spam-filter poisoning",
    background: "<p>Spam filters can be poisoned when attacker-controlled messages enter training. The corrupted risk mixes ordinary clean risk with trigger-targeted bad risk.</p>",
    numbers: "<p>The plan's formula is $R_{poison}=(1-\\alpha)R_{clean}+\\alpha R_{bad}$. Illustrative poison rates 0%, 2%, 5%, and 10% make the effect of $\\alpha$ visible.</p>"
  },
  {
    title: "Recommender abuse detection",
    background: "<p>Recommenders can be steered by rare high-leverage examples, especially in sparse regions where a small campaign changes the learned neighborhood.</p>",
    numbers: "<p>The leading component share is only $|0.050|/0.570=0.088$. A small 8.8% clean component can still coexist with a large hidden bad-risk term.</p>"
  },
  {
    title: "Data dedup pipelines",
    background: "<p>Deduplication helps but may fail if near-duplicates preserve the trigger feature while looking different enough to survive filtering.</p>",
    numbers: "<p>Removing mechanism three changes the lesson score by $0.450-0.570=-0.120$. A dedup ablation should similarly show whether trigger behavior actually falls.</p>"
  },
  {
    title: "Model supply-chain QA",
    background: "<p>Supply-chain checks test models received from others under conditional triggers, targeted labels, and clean validation slices.</p>",
    numbers: "<p>With knob 0.080, the guarded lesson value is $0.570+0.080\\cdot0.570=0.616$ after rounding. That small guard is not a substitute for trigger-slice testing.</p>"
  }
];

window.ALLML_CONTENT["19.11"].applications = [
  {
    title: "API abuse defense",
    background: "<p>Prediction APIs can leak behavior when an attacker queries inputs and trains a substitute model on the responses. This is a gap topic, so these applications follow the plan's stable numbers.</p>",
    numbers: "<p>The lesson objective components sum to $0.900+0.600+0.300=1.800$, matching the average distillation loss idea $\\frac1q\\sum_i\\ell(g(x_i),f(x_i))$.</p>"
  },
  {
    title: "Rate-limit design",
    background: "<p>Rate limits based only on query count miss adaptive strategies. Boundary queries can reveal more about a classifier than random interior queries.</p>",
    numbers: "<p>An illustrative query budget ladder 10, 25, 50, 100, 200, 500 estimates agreement as $q$ grows. A flat count limit ignores whether the 50 queries are boundary-focused.</p>"
  },
  {
    title: "Model IP monitoring",
    background: "<p>IP monitoring cares about behavioral similarity even when the stolen model's parameters are unrelated to the original model's parameters.</p>",
    numbers: "<p>The top lesson share is $|0.900|/1.800=0.500$. If half the behavioral loss comes from one query region, agreement tests should stratify by that region.</p>"
  },
  {
    title: "Confidence-output policy",
    background: "<p>Returning probabilities can leak more than returning hard labels because confidence reveals distance to decision boundaries.</p>",
    numbers: "<p>The lesson guard moves from 1.800 to $1.800+0.150\\cdot1.800=2.070$. That 0.270 increase is the illustrative cost of the extra exposure.</p>"
  },
  {
    title: "Watermark validation",
    background: "<p>Watermark probes test whether suspicious models reproduce behavior on special inputs that legitimate independent models would not copy.</p>",
    numbers: "<p>Removing mechanism three changes the score by $1.500-1.800=-0.300$. A watermark ablation similarly asks whether copied behavior disappears when the probe mechanism is removed.</p>"
  }
];

window.ALLML_CONTENT["19.12"].applications = [
  {
    title: "Healthcare model privacy audit",
    background: "<p>Membership inference is a privacy audit for sensitive training sets: high confidence on a record can reveal that it was used during training.</p>",
    numbers: "<p>The lesson confidence components sum to $0.820+0.550+0.270=1.640$. A threshold attack implements $\\hat m=\\mathbf{1}[s(x,y)\\ge\\tau]$ on those confidence-like scores.</p>"
  },
  {
    title: "Education analytics",
    background: "<p>Education models may have imbalanced member and nonmember pools. Advantage is safer than raw attack accuracy because it separates true-positive and false-positive rates.</p>",
    numbers: "<p>With illustrative member prior 0.500, balanced attack accuracy is $0.5(\\mathrm{TPR}+1-\\mathrm{FPR})$, while advantage is $\\mathrm{TPR}-\\mathrm{FPR}$.</p>"
  },
  {
    title: "Face recognition deployment",
    background: "<p>Face models can leak rare identities even when aggregate accuracy looks strong. Audits must inspect confidence distributions, not just top-line test error.</p>",
    numbers: "<p>The largest lesson confidence share is $|0.820|/1.640=0.500$. A 50% share means one confidence mechanism carries half of the privacy signal.</p>"
  },
  {
    title: "Calibration-aware release",
    background: "<p>Calibration affects whether confidence thresholds transfer across populations. The threshold must be chosen without peeking at the victim membership labels.</p>",
    numbers: "<p>The guarded lesson value is $1.640+0.650\\cdot1.640=2.706$. That large guard shows why privacy auditing should not be reduced to clean accuracy.</p>"
  },
  {
    title: "DP regression test",
    background: "<p>Differential-privacy regression tests can track whether changes reduce the confidence gap used by membership attackers.</p>",
    numbers: "<p>Removing mechanism three changes the lesson score by $1.370-1.640=-0.270$. A DP-oriented test should see confidence-gap changes of this kind shrink, not grow.</p>"
  }
];

/* ---- _apps-part19-C.js ---- */
window.ALLML_CONTENT["19.13"].applications = [
  {
    title: "Census statistics release",
    background: "<p>Statistical agencies use differential privacy when public tables must be useful but no single household should noticeably change a released result.</p>",
    numbers: "<p>In the lesson audit, the privacy components are $1.000$, $0.500$, and $0.100$, so $total=1.000+0.500+0.100=1.600$.</p>"
  },
  {
    title: "Federated analytics",
    background: "<p>Device analytics systems spend privacy budget each time they release an aggregate, so repeated reports require composition accounting.</p>",
    numbers: "<p>With illustrative knob $0.800$, the guarded score is $1.600+0.800\\cdot1.600=2.880$, showing the added privacy cost.</p>"
  },
  {
    title: "Search-log dashboards",
    background: "<p>Search telemetry can leak rare behavior, so dashboards use noise and a small failure budget rather than treating rare failures as impossible.</p>",
    numbers: "<p>An illustrative $\\delta=10^{-5}$ is still a probability budget; the DP check remains $P(M(D)=o)\\le e^\\varepsilon P(M(D')=o)+\\delta$.</p>"
  },
  {
    title: "Healthcare model training",
    background: "<p>DP-SGD and DP aggregates reduce membership-inference surface before a model is released or audited.</p>",
    numbers: "<p>The largest component share is $|1.000|/(|1.000|+|0.500|+|0.100|)=1.000/1.600=0.625$.</p>"
  },
  {
    title: "A/B reporting",
    background: "<p>Experiment reports need sensitivity before choosing noise; otherwise the reported privacy level has no operational meaning.</p>",
    numbers: "<p>Removing mechanism three gives $contrast=1.600-0.100=1.500$ and $change=1.500-1.600=-0.100$.</p>"
  }
];

window.ALLML_CONTENT["19.14"].applications = [
  {
    title: "User deletion compliance",
    background: "<p>Unlearning supports deletion requests by approximating the influence of a removed example instead of always retraining from scratch.</p>",
    numbers: "<p>For the gap-topic lesson toy, $0.240+-0.100+0.040=0.180$, matching the planned update total.</p>"
  },
  {
    title: "Vector-search cleanup",
    background: "<p>Removing a user from a model is insufficient when derived embeddings, caches, and indexes still carry that user's influence.</p>",
    numbers: "<p>An illustrative lineage has $3$ artifacts: model parameters, embedding cache, and search index, all of which must pass cleanup.</p>"
  },
  {
    title: "Dataset takedown",
    background: "<p>When a source dataset is withdrawn, teams compare an influence approximation against exact retraining to decide whether the residual is acceptable.</p>",
    numbers: "<p>The top update share is $|0.240|/(|0.240|+|-0.100|+|0.040|)=0.240/0.380\\approx0.632$.</p>"
  },
  {
    title: "Recommendation index refresh",
    background: "<p>First-order updates can work for small deletions but become unreliable when many points are removed at once.</p>",
    numbers: "<p>Illustrative deletion fractions $1\\%$, $5\\%$, and $20\\%$ test the transition from one-point influence to batch retraining risk.</p>"
  },
  {
    title: "Privacy incident response",
    background: "<p>After a privacy incident, unlearning audits verify that the intended influence and all derived artifacts were actually removed.</p>",
    numbers: "<p>Removing mechanism three yields $contrast=0.180-0.040=0.140$ and $change=0.140-0.180=-0.040$.</p>"
  }
];

window.ALLML_CONTENT["19.15"].applications = [
  {
    title: "Model IP verification",
    background: "<p>Watermark tests query controlled triggers and ask whether the hit count is too high under an innocent null model.</p>",
    numbers: "<p>The lesson counts are $18$, $10$, and $4$, so $total=18+10+4=32$ before the z-test audit.</p>"
  },
  {
    title: "Dataset license audits",
    background: "<p>Provenance records complement watermarks by documenting which data and transformations produced a release artifact.</p>",
    numbers: "<p>An illustrative $4$-step chain is licensed data $\\to$ training run $\\to$ model card $\\to$ release bundle.</p>"
  },
  {
    title: "Stolen-model detection",
    background: "<p>Copied-model investigations need false-positive control, so trigger hits are converted into a significance statistic.</p>",
    numbers: "<p>The leading count share is $|18|/(|18|+|10|+|4|)=18/32=0.5625\\approx0.562$.</p>"
  },
  {
    title: "Safety watermark design",
    background: "<p>A watermark should be detectable without becoming a harmful backdoor or changing ordinary user behavior.</p>",
    numbers: "<p>With illustrative guard knob $0.500$, the count score rises from $32$ to $32+0.500\\cdot32=48.000$.</p>"
  },
  {
    title: "Release evidence bundle",
    background: "<p>Release gates collect trigger-test power, false-positive assumptions, and provenance evidence in one audit bundle.</p>",
    numbers: "<p>Removing the $4$-count mechanism gives $contrast=32-4=28$ and $change=28-32=-4$.</p>"
  }
];

window.ALLML_CONTENT["19.16"].applications = [
  {
    title: "Weather-style risk scores",
    background: "<p>Probability forecasts are useful only if events predicted at a given confidence happen at about that frequency.</p>",
    numbers: "<p>The lesson ECE components sum to $0.100+0.050+0.200=0.350$.</p>"
  },
  {
    title: "Medical triage probabilities",
    background: "<p>Triage systems need reliable probabilities because two equally accurate models can imply different intervention thresholds.</p>",
    numbers: "<p>The top bin share is $|0.100|/(|0.100|+|0.050|+|0.200|)=0.100/0.350\\approx0.286$.</p>"
  },
  {
    title: "Credit pricing",
    background: "<p>Loan pricing uses predicted risk as a number, so overconfidence or underconfidence can affect approvals and rates.</p>",
    numbers: "<p>With guard knob $0.200$, $guarded=0.350+0.200\\cdot0.350=0.420$.</p>"
  },
  {
    title: "Search ranking confidence",
    background: "<p>Ranking systems may expose confidence to downstream business rules, making bin stability and sample size important.</p>",
    numbers: "<p>An illustrative comparison of $5$ bins versus $20$ bins checks whether $acc(b)$ is stable or noisy on small data.</p>"
  },
  {
    title: "Autonomous system fallback",
    background: "<p>Fallback policies should trigger from calibrated uncertainty, not from a raw confidence that may be overconfident under stress.</p>",
    numbers: "<p>Removing the largest bin error gives $contrast=0.350-0.200=0.150$ and $change=0.150-0.350=-0.200$.</p>"
  }
];

window.ALLML_CONTENT["19.17"].applications = [
  {
    title: "Medical diagnosis sets",
    background: "<p>Conformal prediction can return a small set of plausible diagnoses while preserving a finite-sample marginal coverage target.</p>",
    numbers: "<p>The lesson nonconformity components sum to $0.100+0.200+0.350=0.650$.</p>"
  },
  {
    title: "Demand forecasting intervals",
    background: "<p>Forecasting teams use calibration residuals to choose an interval width that targets coverage without assuming Gaussian errors.</p>",
    numbers: "<p>For illustrative $\\alpha=0.100$, the target coverage is $1-\\alpha=0.900$, and the rank is $\\lceil(n+1)(1-\\alpha)\\rceil$.</p>"
  },
  {
    title: "Autonomous fallback",
    background: "<p>Prediction sets grow when examples are harder or shifted, giving a direct signal for fallback rather than forced classification.</p>",
    numbers: "<p>The first residual share is $|0.100|/(|0.100|+|0.200|+|0.350|)=0.100/0.650\\approx0.154$.</p>"
  },
  {
    title: "Legal-document classification",
    background: "<p>Marginal coverage can be acceptable while a subgroup is undercovered, so audits break out coverage by segment.</p>",
    numbers: "<p>An illustrative subgroup gap of $0.100$ means one segment at $0.800$ coverage against a $0.900$ target needs investigation.</p>"
  },
  {
    title: "Fraud review queue",
    background: "<p>Fraud systems can send multi-label conformal sets to reviewers when a single class is not trustworthy enough.</p>",
    numbers: "<p>Removing the largest residual gives $contrast=0.650-0.350=0.300$ and $change=0.300-0.650=-0.350$.</p>"
  }
];

window.ALLML_CONTENT["19.18"].applications = [
  {
    title: "Medical imaging intake",
    background: "<p>OOD screening checks whether a scan resembles training support before ordinary diagnostic predictions are trusted.</p>",
    numbers: "<p>The lesson OOD scores sum to $0.800+1.400+2.100=4.300$.</p>"
  },
  {
    title: "Fraud model monitoring",
    background: "<p>Monitoring systems threshold an unfamiliarity score to route strange traffic for review before model outputs drive action.</p>",
    numbers: "<p>The leading score share is $|0.800|/(|0.800|+|1.400|+|2.100|)=0.800/4.300\\approx0.186$.</p>"
  },
  {
    title: "Autonomous driving",
    background: "<p>High confidence can occur far from training data, so distance or energy scores are used alongside class probabilities.</p>",
    numbers: "<p>With illustrative knob $1.500$, $guarded=4.300+1.500\\cdot4.300=10.750$.</p>"
  },
  {
    title: "Content moderation",
    background: "<p>Moderation pipelines distinguish covariate, label, and concept shifts because each requires a different operational response.</p>",
    numbers: "<p>An illustrative $3$-shift stress panel separates covariate shift, label shift, and concept shift before choosing a mitigation.</p>"
  },
  {
    title: "Digit classifier rejection",
    background: "<p>Small classifiers can reject inputs that are too distant from training representations instead of forcing a digit label.</p>",
    numbers: "<p>Removing the largest OOD component gives $contrast=4.300-2.100=2.200$ and $change=2.200-4.300=-2.100$.</p>"
  }
];

/* ---- _apps-part19-D.js ---- */
window.ALLML_CONTENT["19.19"].applications = [
  { title: "Medical imaging shortcuts", background: "<p>Hospital scanners, site marks, and watermarks can correlate with labels when data is pooled from different clinics. Shortcut audits ask whether a model uses the disease signal or the environment cue.</p>", numbers: "<p>The lesson environment-gap components are illustrative: $0.100+0.320+0.220=0.640$. A train-only validation can hide that full $\Delta_{env}=0.640$ risk increase under shift.</p>" },
  { title: "Hiring text screening", background: "<p>Resume models can learn school names, clubs, gaps, or phrasing as proxies for protected attributes. Removing only the explicit sensitive field does not remove every shortcut.</p>", numbers: "<p>The top shortcut share in the lesson toy is $|0.100|/(|0.100|+|0.320|+|0.220|)=0.156$. That means about 15.6% of the audited explanatory mass sits in one mechanism.</p>" },
  { title: "Wildlife image classification", background: "<p>Camera traps often put species in characteristic backgrounds, so a classifier can learn snow, grass, or night lighting instead of the animal. A new habitat then flips the cue.</p>", numbers: "<p>With an illustrative 80/20 train split, the cue agrees with the label in 80% of train images but only 20% after environment shift. The sign flip is exactly what $R_{shift}(h)-R_{train}(h)$ is designed to expose.</p>" },
  { title: "Fraud detection proxy ablation", background: "<p>Fraud systems may use device, location, or timing proxies that work historically but fail after adversaries adapt. Proxy ablation measures whether the decision still stands without the shortcut.</p>", numbers: "<p>The lesson guard uses knob 0.200: $0.640+0.200\cdot0.640=0.768$. The extra 0.128 is the price of treating shortcut risk as deployment risk, not decoration.</p>" },
  { title: "Content ranking environment checks", background: "<p>Ranking systems can learn creator, format, or source shortcuts that match past engagement but fail when inventory changes. Environment-split evaluation tests stability before launch.</p>", numbers: "<p>Removing mechanism three changes the lesson score by $0.420-0.640=-0.220$. A 0.220 swing is large enough to require a proxy audit before trusting the ranking lift.</p>" }
];

window.ALLML_CONTENT["19.20"].applications = [
  { title: "Treatment-effect estimation", background: "<p>Clinical and product experiments need the effect of an intervention, not just an association. Inverse propensity weighting reweights observed data toward the randomized comparison we wish we had.</p>", numbers: "<p>The lesson ATE components sum to $1.200+0.800+0.400=2.400$. The IPW target is $\mathbb{E}[TY/e(X)-(1-T)Y/(1-e(X))]$, so each denominator must match treatment assignment.</p>" },
  { title: "Ad campaign incrementality", background: "<p>Campaign lift studies ask whether ads caused conversions that would not otherwise happen. Users with near-certain or near-impossible exposure make observational estimates unstable.</p>", numbers: "<p>An illustrative clipping rule $0.05\le e(X)\le0.95$ caps the largest inverse weight at $1/0.05=20$. Without clipping, a propensity of 0.01 would create a weight of 100.</p>" },
  { title: "Policy evaluation", background: "<p>Policy teams often have historical decisions but need to evaluate a different action rule. Prediction $P(Y\mid X)$ can be accurate while answering the wrong causal question.</p>", numbers: "<p>The leading lesson component share is $1.200/2.400=0.500$. Half of the audited effect sits in one mechanism, so calling the whole association causal would be unsafe.</p>" },
  { title: "Healthcare comparative effectiveness", background: "<p>Comparative effectiveness studies adjust for severity, age, and history, but post-treatment variables can be colliders. Declaring the adjustment set prevents outcome leakage.</p>", numbers: "<p>The lesson guard with knob 0.500 is $2.400+0.500\cdot2.400=3.600$. The 1.200 increase represents the extra caution needed when overlap and adjustment are fragile.</p>" },
  { title: "Uplift targeting foundation", background: "<p>Uplift models are causal targeting systems, so their foundation is an estimated treatment effect. If one mechanism is omitted, the targeting rule can chase response rather than incrementality.</p>", numbers: "<p>Removing mechanism three changes the lesson ATE from 2.400 to 2.000, a difference of $2.000-2.400=-0.400$. That is a direct causal-audit failure signal.</p>" }
];

window.ALLML_CONTENT["19.21"].applications = [
  { title: "Marketing targeting", background: "<p>Marketing teams want to spend on users whose behavior changes because of contact, not users who would convert anyway. Uplift scores estimate incremental response.</p>", numbers: "<p>The lesson uplift components are illustrative: $0.300+0.180+0.120=0.600$. A model ranking by baseline conversion alone can miss that 0.600 incremental target.</p>" },
  { title: "Notification suppression", background: "<p>Some users are discouraged by reminders, so sending a notification can reduce engagement. Uplift bins make negative treatment effects visible before rollout.</p>", numbers: "<p>An illustrative bin range from -0.10 to +0.30 spans 0.40 uplift points. Users near -0.10 should be suppressed even if their baseline response probability is high.</p>" },
  { title: "Healthcare outreach", background: "<p>Outreach programs need to know who changes behavior because of a call, message, or appointment reminder. Random assignment protects the uplift label from historical targeting bias.</p>", numbers: "<p>The top lesson share is $0.300/0.600=0.500$. Half of the uplift mass comes from one mechanism, so a biased assignment policy can dominate the learned ranking.</p>" },
  { title: "Sales discounting", background: "<p>Discount systems can waste margin on customers who would buy without an offer. A T-learner compares treated and control response estimates for the same feature profile.</p>", numbers: "<p>The lesson guard is $0.600+0.100\cdot0.600=0.660$. The extra 0.060 is the illustrative cost of guarding against targeting likely converters rather than incremental buyers.</p>" },
  { title: "Fair intervention delivery", background: "<p>Interventions can reach groups differently when historical assignment is biased. Uplift evaluation should check whether high-scored groups have comparable control support.</p>", numbers: "<p>Removing mechanism three changes the lesson uplift by $0.480-0.600=-0.120$. A 0.120 drop can flip who should receive the intervention.</p>" }
];

window.ALLML_CONTENT["19.22"].applications = [
  { title: "LLM release gates", background: "<p>Red-team launch reviews convert broad safety concerns into scenario tests, rates, weights, and go or no-go gates. A weighted score makes tradeoffs explicit.</p>", numbers: "<p>The lesson risk score is $0.050+0.100+0.200=0.350$. This is the concrete form of $S=\sum_j w_j r_j$ when the illustrative weights are all 1.</p>" },
  { title: "Fraud model stress tests", background: "<p>Fraud models face adaptive attackers, so stress tests must report rates per scenario rather than only the number of found failures. Denominators make severities comparable.</p>", numbers: "<p>The top lesson component share is $0.050/0.350=0.143$. A raw count cannot reveal whether that 14.3% share came from 5 failures in 100 cases or 5 failures in 10 cases.</p>" },
  { title: "Privacy and fairness launch review", background: "<p>Responsible release gates combine security, privacy, and fairness measurements instead of letting one flattering metric dominate. The same risk card can hold multiple harm types.</p>", numbers: "<p>The lesson guard uses knob 0.600: $0.350+0.600\cdot0.350=0.560$. The added 0.210 is the cost of treating unresolved privacy and fairness risk as launch risk.</p>" },
  { title: "Regression test suites", background: "<p>Once a red-team failure is fixed, it should become a regression test. Otherwise a future model or prompt change can silently reintroduce the same issue.</p>", numbers: "<p>An illustrative 5-scenario red-team pack with one fixed test per scenario has five regression checks. Passing 4 of 5 means a failure rate of $1/5=0.200$ for the pack.</p>" },
  { title: "Independent safety audit", background: "<p>Independent graders reduce incentives for the model author to define away failures. External review also checks whether the chosen denominators and gates match user harm.</p>", numbers: "<p>Removing the largest lesson risk component gives $0.150-0.350=-0.200$. A 0.200 change from one omitted component shows why independent scenario coverage matters.</p>" }
];

