# M24 · Counterfactual / off-policy evaluation
> **Domain:** Domain 5 · Bandits & RL · **Maps to:** Advanced · **Skip if you can already…** estimate a policy's value from logged data (IPS/DR)

## Overview

Off-policy evaluation asks: **how would a new policy have performed if it had made decisions in old logs?** Rewards alone are not enough. The log must include context, action, propensity, and reward, otherwise you cannot correct for the fact that the old policy chose the actions.

IPS reweights logged rewards by how much more or less likely the new policy was to take the logged action. Doubly Robust estimation starts from a reward model and then adds an IPS correction for observed residuals.

**By the end you can answer:**
- Why evaluate a policy from logged data?
- What is logged bandit feedback: context, action, propensity, reward?
- What is the IPS estimator, and why can its variance be high?
- What is self-normalized IPS (SNIPS)?
- What is Doubly Robust estimation, and why combine a model with a correction?
- How do you compute an IPS/DR estimate on a small logged table?

Two sub-lessons:

- **M24.1 IPS & self-normalized IPS** — importance weighting and variance.
- **M24.2 Doubly Robust estimation** — reward model plus residual correction.

---

## M24.1 · IPS & self-normalized IPS

**The idea.** A logged bandit row contains:

**Everyday analogy.** Off-policy evaluation is like asking whether a new restaurant menu would have sold better using only receipts from the old menu. You cannot simply count old sales, because the old menu made some dishes easy to choose and others rare; the propensity is how likely the old menu was to show or promote each dish. IPS reweights each receipt by "how likely would the new menu have led to this same choice divided by how likely the old menu did?"

| symbol | field | meaning |
|---|---|---|
| $x_i$ | context | features known before decision |
| $a_i$ | action | action chosen by the logging policy |
| $p_i=\pi_0(a_i\mid x_i)$ | propensity | probability the logger assigned to that action |
| $r_i$ | reward | observed outcome for the chosen action |

The evaluation policy is $\pi_e$. The importance weight is

$$w_i=\frac{\pi_e(a_i\mid x_i)}{\pi_0(a_i\mid x_i)}.$$

The IPS value estimate is

$$\hat V_{\text{IPS}}=\frac{1}{n}\sum_{i=1}^n w_ir_i.$$

**Why IPS is unbiased, intuitively.** For a fixed context $x$, take expectation over the logging action:

$$\mathbb{E}_{a\sim\pi_0}\left[\frac{\pi_e(a\mid x)}{\pi_0(a\mid x)}r(x,a)\right]
=\sum_a\pi_0(a\mid x)\frac{\pi_e(a\mid x)}{\pi_0(a\mid x)}r(x,a).$$

The logging probability cancels:

$$=\sum_a\pi_e(a\mid x)r(x,a).$$

That is the evaluation policy's expected reward for that context. The catch is support: if the new policy can choose an action that the logging policy never tried, $\pi_0(a\mid x)=0$ and the counterfactual reward is unknowable from those logs.

**Worked example — compute IPS by hand.** A deterministic new policy chooses the `target action` below.

| row | context | logged action | propensity | reward | target action | target prob | weight | weighted reward |
|---:|---|---|---:|---:|---|---:|---:|---:|
| 1 | high intent | A | 0.50 | 1 | A | 1 | 2.00 | 2.00 |
| 2 | low intent | B | 0.25 | 0 | B | 1 | 4.00 | 0.00 |
| 3 | high intent | B | 0.20 | 1 | A | 0 | 0.00 | 0.00 |
| 4 | low intent | A | 0.50 | 0 | A | 1 | 2.00 | 0.00 |
| 5 | high intent | A | 0.10 | 1 | A | 1 | 10.00 | 10.00 |
| 6 | low intent | B | 0.50 | 1 | A | 0 | 0.00 | 0.00 |

The weighted reward sum is

$$2+0+0+0+10+0=12.$$

With six rows,

$$\hat V_{\text{IPS}}=12/6=2.0.$$

A binary reward value estimate above 1 looks strange, but it is possible in a small IPS sample because row 5 has a huge weight. This is variance, not a proof that the policy is magical.

Self-normalized IPS divides by total weight:

$$\hat V_{\text{SNIPS}}=\frac{\sum_iw_ir_i}{\sum_iw_i}.$$

Here total weight is

$$2+4+0+2+10+0=18,$$

so

$$\hat V_{\text{SNIPS}}=12/18=0.667.$$

SNIPS is usually more stable and scale-friendly, but introduces bias because the denominator is random.

**Diagnostics.** Before trusting IPS, check support, maximum weight, weight percentiles, effective sample size, clipping sensitivity, and confidence intervals. A single row with propensity 0.01 can dominate an estimate.

```python
w = target_probability / logging_propensity
ips = mean(w * reward)
snips = sum(w * reward) / sum(w)
assert all(logging_propensity[target_probability > 0] > 0)
```

**You'll be able to say:** *"Logged bandit feedback needs context, action, propensity, and reward. IPS estimates $\hat V=\frac1n\sum w_ir_i$ with $w_i=\pi_e/\pi_0$; it is unbiased because $\pi_0$ cancels in expectation, but small propensities create high variance. SNIPS normalizes by total weight for stability, with some bias."*

---

## M24.2 · Doubly Robust estimation

**The idea.** A reward model $\hat q(x,a)$ predicts reward for each action. The direct-method target value for one row is

**Everyday analogy.** Doubly Robust estimation is like judging that new menu with both a chef's sales forecast and the old receipts. The reward model is the chef's prediction for every dish under the new menu; the IPS correction says, "when the old receipt actually matches something the new menu would have done, use that real outcome to correct the forecast." It is called doubly robust because the estimate can still be good if either the forecast is decent or the propensities are decent.

$$\hat v(x_i)=\sum_a\pi_e(a\mid x_i)\hat q(x_i,a).$$

Doubly Robust estimation adds an IPS correction for the logged action:

$$\hat V_{\text{DR}}=\frac1n\sum_{i=1}^n\left[\sum_a\pi_e(a\mid x_i)\hat q(x_i,a)+w_i(r_i-
\hat q(x_i,a_i))\right].$$

The first term is the model's guess for the target policy. The second term corrects the model using observed residuals on rows where logging gives information about the target policy.

**Worked example — DR on the same table.** Add model predictions.

| row | logged | p | reward | target | w | $\hat q(x,target)$ | $\hat q(x,logged)$ | DR contribution |
|---:|---|---:|---:|---|---:|---:|---:|---:|
| 1 | A | 0.50 | 1 | A | 2 | 0.60 | 0.60 | $0.60+2(1-0.60)=1.40$ |
| 2 | B | 0.25 | 0 | B | 4 | 0.30 | 0.30 | $0.30+4(0-0.30)=-0.90$ |
| 3 | B | 0.20 | 1 | A | 0 | 0.70 | 0.40 | $0.70+0(1-0.40)=0.70$ |
| 4 | A | 0.50 | 0 | A | 2 | 0.20 | 0.20 | $0.20+2(0-0.20)=-0.20$ |
| 5 | A | 0.10 | 1 | A | 10 | 0.80 | 0.80 | $0.80+10(1-0.80)=2.80$ |
| 6 | B | 0.50 | 1 | A | 0 | 0.25 | 0.50 | $0.25+0(1-0.50)=0.25$ |

Sum the contributions:

$$1.40-0.90+0.70-0.20+2.80+0.25=4.05.$$

Therefore

$$\hat V_{\text{DR}}=4.05/6=0.675.$$

Compare:

- direct method: $(0.60+0.30+0.70+0.20+0.80+0.25)/6=0.475$;
- IPS: $12/6=2.0$;
- SNIPS: $12/18=0.667$;
- DR: $4.05/6=0.675$.

DR is not automatically correct. It is useful because if the reward model is right, residuals average out; if propensities are right, residual correction can remove model bias. In practice, report both nuisance checks.

```python
direct = sum(pi_e[a] * q_hat[x, a] for a in actions)
correction = (pi_e[logged_action] / pi_0[logged_action]) * (reward - q_hat[x, logged_action])
dr = direct + correction
```

**Evaluation protocol.** A credible OPE report includes the target policy, logging policy, support check, propensity diagnostics, IPS/SNIPS/DR side by side, clipping sensitivity, model validation, confidence intervals, and comparison to randomized truth or an A/B test when possible.

**You'll be able to say:** *"Doubly Robust estimation starts with the reward model's target-policy prediction and adds an IPS-weighted residual $w(r-\hat q)$ for the logged action. It combines model-based stability with counterfactual correction, but I still validate propensities, support, model quality, clipping sensitivity, and intervals."*

---

## Resources
- Open Bandit Pipeline (docs + paper) (off-policy estimators on real logged data)

## Papers
- Doubly Robust Policy Evaluation and Learning (Dudík et al., 2011)
