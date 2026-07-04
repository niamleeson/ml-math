# Module Plan — M24 · Counterfactual / off-policy evaluation

| Field | Value |
|---|---|
| Domain | Domain 5 · Bandits & RL |
| Skip if you can already… | estimate a policy's value from logged data (IPS/DR) |
| Maps to (projects) | Advanced |
| Primary structure(s) | S2 Method / Algorithm + S8 Evaluation Protocol |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
Off-policy evaluation asks: can we estimate how a new policy would have performed using logs from an
old policy? This module teaches the logged bandit data contract, IPS and SNIPS importance weighting,
and Doubly Robust estimation so learners can compute and sanity-check counterfactual values from a
small table before trusting a large-scale evaluation.

- M24.1 · IPS & self-normalized IPS (importance weighting, variance)
- M24.2 · Doubly Robust estimation

## Questions this module answers (→ which sub-lesson teaches the answer)
- Why evaluate a policy from logged data? → M24.1
- What is logged bandit feedback: context, action, propensity, reward? → M24.1
- What is the IPS estimator, and why can its variance be high? → M24.1
- What is self-normalized IPS (SNIPS)? → M24.1
- What is Doubly Robust estimation, and why combine a model with a correction? → M24.2
- How do you compute an IPS/DR estimate on a small logged table? → M24.1, M24.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Logged bandit feedback: context `x`, logged action `a`, logging propensity `p(a|x)`, reward `r`
- Target/evaluation policy `π_e`; logging policy `π_b`; support/overlap
- IPS estimator **ƒ**; importance weight; variance and propensity clipping
- Self-normalized IPS / SNIPS **ƒ**
- Reward model / direct method; Doubly Robust estimator **ƒ**
- Evaluation protocol: measure → validate vs randomized truth → debias/sensitivity-check

## Sub-lessons

### M24.1 · IPS & self-normalized IPS (importance weighting, variance)  —  [S2 Method + S8 Eval, ⚑]
- **Makes answerable:** why off-policy evaluation; logged bandit feedback; IPS; variance; SNIPS; the IPS part of a small logged-table estimate.
- **You'll be able to say:** "Logged bandit feedback stores what context arrived, what action the logging policy took, that action's propensity, and the observed reward. IPS estimates a new policy by reweighting rows where the logged action matches the target policy by `π_e(a|x)/π_b(a|x)`, but small propensities create large weights and high variance. SNIPS divides by total weight to reduce scale instability, with some bias."
- **Concepts:** logged feedback, target vs logging policy, support, IPS **ƒ**, variance, clipping, SNIPS **ƒ**.
- **Key Idea focus:** step-by-step estimator + S8 validation: compute weights, inspect weight distribution, compare against known randomized holdout when possible.
- **Worked-example shape:** measure → validate → debias — compute IPS and SNIPS on a 5–6 row table; then show one tiny propensity row dominating the estimate and clip/sensitivity-check it.
- **Notebook:** Yes — numpy/pandas logged bandit table with contexts, logged actions, propensities, rewards, and deterministic target choices; `assert` no target action lacks logging support. Break case = a row with propensity 0.01 dominating IPS.
- **Real numbers to cite:** example rows with matched rewards `[1,0,1]` and weights `[2,5,10]` produce IPS sum `12/6=2.0` but SNIPS `12/17=0.706`; the contrast motivates variance checks.

### M24.2 · Doubly Robust estimation  —  [S2 Method + S8 Eval, ⚑]
- **Makes answerable:** Doubly Robust estimation; why combine a model with a correction; the DR part of a small logged-table estimate.
- **You'll be able to say:** "DR starts with a reward-model prediction for the target policy, then adds an IPS correction only for the action actually observed. If either the propensities are correct or the reward model is correct, the estimator can remain unbiased; in practice I report model quality, weight diagnostics, clipping sensitivity, and confidence intervals."
- **Concepts:** direct reward model, correction term, DR estimator **ƒ**, nuisance-model validation, clipping/sensitivity, confidence intervals.
- **Key Idea focus:** method + evaluation protocol: model baseline value, residual correction, validate both the model and the propensity assumptions.
- **Worked-example shape:** measure → validate → debias — compute model-only value, IPS correction, and DR on the same tiny table; compare when the reward model is good vs misspecified.
- **Notebook:** Yes — small table with predicted rewards for each action; compute DR row by row; `assert` DR equals direct method when all target actions are unobserved/no correction and moves toward IPS when residuals are large. Break case = reward model trained with leaked post-action features.
- **Real numbers to cite:** for a matched row with `q_hat=0.30`, observed `r=1`, and weight `2`, DR contribution is target model value plus `2·(1-0.30)=1.40` correction on that row.

## Coverage check
All 6 module questions map to a sub-lesson: motivation/logged feedback/IPS/SNIPS/variance → M24.1; DR and model-plus-correction estimation → M24.2; small-table computation appears in both. No gaps.

## Decision guide
| Estimator | Use when | Watch out for |
|---|---|---|
| IPS | Propensities are logged and overlap is good | High variance from small propensities |
| SNIPS | Need a more stable normalized estimate | Introduces bias; still needs support |
| Direct Method | Reward model is strong and logged support is weak | Model bias can dominate |
| Doubly Robust | You have propensities and a plausible reward model | Validate both; clipping/sensitivity still required |

## Resources (from the guide)
- Open Bandit Pipeline (docs + paper) (off-policy estimators on real logged data)

## SOTA papers (from the guide)
- Doubly Robust Policy Evaluation and Learning (Dudík et al., 2011)

## Notes / caveats
- The worked example should be a tiny 5–6 row logged table with propensities so learners can compute by hand before running the notebook.
- Be explicit that OPE requires support/overlap; no estimator can recover actions the logging policy never tried.
