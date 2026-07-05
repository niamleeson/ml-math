# M28 · Ads marketplace optimization
> **Domain:** Domain 6 · Optimization & Marketplace · **Maps to:** Instream Ads perf, Event Ads perf, Search Ads · **Skip if you can already…** explain how a calibrated pCTR feeds a marketplace value/allocation

## Overview

An ads marketplace turns predictions into allocation, payment, and delivery over time. M8 gave you calibrated probabilities; M27 gave you optimization, constraints, and shadow prices. This capstone connects them: a calibrated pCTR becomes an expected value, the auction allocates scarce attention, pacing decides whether a campaign should compete now, and guardrails keep advertiser, member, and platform outcomes safe.

**By the end you can answer:**
- What is the value of an impression, and why is it calibrated pCTR × bid rather than raw model score × bid?
- Why does calibration matter for marketplace allocation and advertiser/member outcomes?
- How do second-price and GSP auctions work, and how are payments computed?
- How do you compute value-per-impression → winner → payment → pacing multiplier by hand?
- What is budget pacing as a feedback-control loop?
- What is guaranteed delivery / SHALE allocation as constrained optimization?
- How do multi-objective allocation and guardrail constraints enter the marketplace?
- How do calibration + optimization + auction tie together end-to-end?

Two sub-lessons:

- **M28.1 Value of an impression & the auction** — calibrated pCTR turns into marketplace value, allocation, and payment.
- **M28.2 Budget pacing & guaranteed delivery** — control loops and constrained optimization keep spend and delivery on target.

---

## M28.1 · Value of an impression & the auction

**The idea.** For a CPC ad, the expected value of showing advertiser $i$ on impression $t$ is:

$$\text{value}_{i,t}=\widehat{pCTR}_{i,t}\times \text{bid}_i.$$

The probability must be **calibrated**. A score of 0.03 should mean roughly 3 clicks per 100 similar impressions, not merely "higher than another score." Calibration matters because allocation compares money across advertisers: Event Ads, Instream Ads, and Search Ads all need probabilities that behave like probabilities before multiplying by bids.

**Everyday analogy.** Think of an eBay-style auction where bidders value the same item differently, but the winner pays just enough to beat the runner-up rather than their full willingness to pay. In ads, the "bidder's value for this exact item" is not just the bid; it is calibrated pCTR × bid, because an impression expected to click 3 times per 100 is worth more than one expected to click 1 time per 100 at the same bid. Calibration turns model output into a real probability, so the marketplace can compare advertisers in dollars-per-impression and allocate the slot to the highest expected value.

A marketplace mechanism combines:

- **Eligibility:** which campaigns can serve this impression.
- **Value/ranking score:** calibrated pCTR × bid, often adjusted by quality, pacing, or reserves.
- **Allocation:** which eligible ad gets the slot(s).
- **Payment:** what the winner pays, usually tied to the next-best competitor in a second-price or GSP-style rule.
- **Guardrails:** policy, member experience, frequency, hide-rate, and advertiser ROI constraints.

In a single-slot second-price-style CPC auction, rank by expected value. The winner pays the minimum CPC needed to beat the next score:

$$\text{price per click}=\frac{\text{next best value}}{\widehat{pCTR}_{winner}},$$

capped by the winner's bid and floored by any reserve. In multi-slot Search Ads, **generalized second price (GSP)** ranks ads into slots; each advertiser pays enough to keep its position relative to the next ranked advertiser, adjusted for pCTR/quality and slot effects.

**Auction types, concretely, on the same bidders.** Use one eligible Event Ads impression and the same calibrated values: A has pCTR 0.030 and bid 6.00 dollars, so value $0.180$; B has pCTR 0.020 and bid 8.00 dollars, so value $0.160$; C has pCTR 0.050 and bid 2.00 dollars, so value $0.100$.

| Auction rule | Who wins / gets slots | What they pay |
|---|---|---|
| **First-price CPC** | A wins because $0.180$ is highest. | A pays its own bid, 6.00 dollars per click; expected spend per impression is $0.030\times6.00=0.180$. |
| **Second-price-style single-slot CPC** | A wins because $0.180$ is highest. | A pays just enough to beat B's next value: $0.160/0.030=5.33$ dollars per click, below A's 6.00-dollar bid. |
| **GSP Search Ads with two slots** | A gets slot 1, B gets slot 2, C is next. | A pays $0.160/0.030=5.33$ dollars per click; B pays $0.100/0.020=5.00$ dollars per click. |

**Worked example — calibrated pCTR → value → allocation → payment.** An Event Ads impression has three eligible CPC advertisers:

| Advertiser | Calibrated pCTR | Bid | Value = pCTR × bid |
|---|---:|---:|---:|
| A | 0.030 | $6.00 | $0.180 |
| B | 0.020 | $8.00 | $0.160 |
| C | 0.050 | $2.00 | $0.100 |

A wins because $0.180$ is the highest expected value. In a simple next-score CPC payment, A pays:

$$\frac{0.160}{0.030}=5.33,$$

so A is charged about $5.33 per click, below its $6.00 bid. The marketplace allocated the impression to the advertiser with the highest expected value, but the price is determined by the next-best alternative, not by A's full bid.

```python
ads = [
    {"name": "A", "pctr": 0.030, "bid": 6.00},
    {"name": "B", "pctr": 0.020, "bid": 8.00},
    {"name": "C", "pctr": 0.050, "bid": 2.00},
]
for ad in ads:
    ad["value"] = ad["pctr"] * ad["bid"]
winner, runner_up = sorted(ads, key=lambda a: a["value"], reverse=True)[:2]
price_per_click = runner_up["value"] / winner["pctr"]
assert winner["name"] == "A"
assert round(price_per_click, 2) == 5.33
```

Now see why calibration matters. If A's raw uncalibrated model score were 0.015 and the marketplace incorrectly used it as a probability, A's apparent value would be:

$$0.015\times 6.00=0.090.$$

Then B's $0.160$ would win. That is an allocation error: the calibrated marketplace says A has the highest expected value, while the raw-score marketplace gives the impression to B. The advertiser outcome changes, the member sees a different ad, and revenue/ROI calculations become inconsistent.

**Two-slot GSP variant.** Suppose Search Ads has two slots with slot multipliers 1.0 and 0.7, and the same value ranking A ($0.180$), B ($0.160$), C ($0.100$). A receives slot 1, B receives slot 2. A pays enough to beat B for slot 1, about $5.33 per click. B pays enough to beat C for slot 2:

$$\frac{0.100}{0.020}=5.00,$$

so B pays about $5.00 per click, capped by B's $8.00 bid. Real production systems include reserves, quality adjustments, and auction-specific pricing details, but the hand calculation is the core: calibrated value ranks the ads; the next competitor determines the price.

**Instream and quality guardrails.** Instream Ads may include member-experience constraints such as predicted hide-rate or completion-quality thresholds. If C has the highest pCTR but violates a video-quality or policy guardrail, it may be ineligible; the auction should choose among the remaining eligible ads rather than blindly maximizing click value.

**You'll be able to say:** *"For CPC ads, expected value per impression is calibrated pCTR × bid. Calibration matters because allocation compares probabilities times money; raw scores can mis-rank ads and harm advertiser/member outcomes. A second-price or GSP-style auction ranks by value or quality-adjusted value, allocates the slot(s), and charges the minimum price needed to keep the position, often derived from the next competitor's score."*

---

## M28.2 · Budget pacing & guaranteed delivery

**The idea.** A winning auction rule is not enough. Campaigns have budgets over time, guaranteed deals have delivery obligations, and the platform has guardrails. **Budget pacing** is a feedback-control loop: compare actual cumulative spend with the target spend curve, then raise or lower a multiplier or delivery probability so the campaign neither burns budget too early nor underspends.

**Everyday analogy.** Budget pacing is like rationing a week's groceries instead of eating everything by Tuesday: each day you compare what you have used with the target and tighten or loosen consumption. The **target spend curve** is the meal plan, **actual spend** is what has already been eaten, and the **multiplier** is the thermostat-like control that makes the campaign compete less when ahead or more when behind. Guaranteed delivery is the promised dinner you must serve no matter what, so the optimizer reserves enough eligible "ingredients" — impressions — to fulfill the commitment.

A simple controller is:

$$m_{next}=\operatorname{clamp}(m + \eta(\text{target spend}-\text{actual spend}),\ m_{min},\ m_{max}).$$

The multiplier then modifies the auction value:

$$\text{paced value}_{i,t}=m_i\times \widehat{pCTR}_{i,t}\times \text{bid}_i.$$

A campaign ahead of schedule gets a lower multiplier and competes less aggressively; a campaign behind schedule gets a higher multiplier or delivery probability. The point is not to permanently demote the campaign; it is to spend smoothly across the eligible opportunity stream.

**Worked example — pacing changes the next allocation.** Reuse the Event Ads auction from M28.1. A's calibrated value is $0.180$, B's is $0.160$, and C's is $0.100$. Campaign A has a $100 budget over 10 hours, so a linear target by hour 3 is $30. Actual spend is $36, which is $6 ahead of target:

$$\text{error}=30-36=-6.$$

With learning rate $\eta=0.02$, clamp range $[0.2,1.5]$, and current multiplier $m=1.00$:

$$m_{next}=\operatorname{clamp}(1.00 + 0.02(-6),0.2,1.5)=0.88.$$

A's paced value in the next auction is:

$$0.88\times0.180=0.1584.$$

Now B's $0.160$ can win. Pacing protected A's remaining budget without declaring A a bad ad; if A later falls behind target, the multiplier can rise again.

```python
m = 1.00
target_spend = 30
actual_spend = 36
eta = 0.02
m_next = max(0.2, min(1.5, m + eta * (target_spend - actual_spend)))
a_paced_value = m_next * 0.030 * 6.00
assert round(m_next, 2) == 0.88
assert a_paced_value < 0.160  # B can win this impression
```

**Guaranteed delivery and SHALE-style allocation.** Some Event Ads or display-style commitments are not purely auction opportunistic. A reserved sponsor may need delivery against a contracted goal. This becomes constrained optimization over a horizon, not just one impression at a time.

A tiny guaranteed-delivery LP is:

$$
\begin{aligned}
\max_x\quad & \sum_t v_t x_t \\
\text{s.t.}\quad & \sum_t x_t \ge 40 && \text{reserved sponsor must receive 40 impressions}\\
& x_t \le e_t && \text{only eligible impressions can be used}\\
& \sum_{t\in member\ m} x_t \le 3 && \text{frequency cap per member}\\
& \text{predicted hide-rate allocation} \le 0.5\% && \text{member guardrail}\\
& 0\le x_t\le1.
\end{aligned}
$$

The SHALE paper is about guaranteed-display allocation: matching demand to forecast supply while honoring delivery constraints. M27's dual variables tell you the cost of a guarantee: if the delivery constraint's shadow price is high, another guaranteed impression is expensive because it displaces high-value auction demand or scarce member-safe inventory.

**Multi-objective allocation.** Production marketplaces rarely maximize revenue alone. They optimize a primary objective while enforcing guardrails, or combine terms with weights after careful calibration:

- Revenue / expected advertiser value: pCTR × bid.
- Advertiser ROI: avoid clicks unlikely to convert or retain value.
- Member experience: hide-rate, complaint risk, repetition, feed/search relevance.
- Delivery: budgets, pacing, guaranteed impressions, campaign fairness.
- Policy and quality: eligibility, creative approval, brand/member safety.

A safe mental model is:

$$\max\ \text{marketplace value}\quad \text{subject to budget, delivery, policy, quality, and member guardrails}.$$

Do not treat every guardrail as just another score term. Some are hard constraints: an unapproved creative cannot serve; a frequency cap cannot be exceeded; a predicted hide-rate threshold may block or throttle inventory. Others are soft objectives that can be traded off after measurement.

**Value / pacing / guaranteed delivery / guardrails, concretely.**

| Marketplace piece | Concrete instance | Allocation consequence |
|---|---|---|
| **Value of impression** | Event Ads A has calibrated pCTR 0.030 and bid 6.00 dollars, so value is $0.180$; B has pCTR 0.020 and bid 8.00 dollars, so value is $0.160$. | Without other adjustments, A gets the impression because $0.180>0.160$. |
| **Pacing** | A is ahead of its spend target, so its multiplier falls to 0.88; A's paced value becomes $0.88\times0.180=0.1584$. | B's unpaced $0.160$ can now win, preserving A's budget for later Event Ads opportunities. |
| **Guaranteed delivery** | A reserved Event Ads sponsor needs 10 more impressions and forecasts only 12 remaining eligible impressions, so the allocator must deliver about $10/12=83.3\%$ of that remaining supply to satisfy $\sum_t x_t\ge10$. | The delivery constraint can reserve or prioritize eligible impressions even when a pure auction would choose another campaign. |
| **Multi-objective / guardrails** | In Instream Ads, C has pCTR 0.050 and bid 5.00 dollars, value $0.250$, but predicted hide-rate is 0.8% against a hard 0.5% threshold. | C is filtered or throttled despite the highest click value; the auction proceeds with member-safe eligible ads such as A or B. |

**End-to-end loop.** For Search Ads, Instream Ads, and Event Ads, the production loop is:

1. Generate eligible ads for the request.
2. Predict calibrated pCTR and other quality outcomes.
3. Compute value: calibrated pCTR × bid.
4. Apply pacing multipliers, reserves, eligibility, and guardrails.
5. Run the auction/allocation mechanism and compute payment.
6. Observe impressions, clicks, spend, hides, conversions, and delivery.
7. Update pacing state, forecasts, calibration checks, and allocation constraints.

If calibration is wrong, step 3 misvalues ads. If optimization is wrong, step 4 violates constraints or leaves value on the table. If pacing is wrong, campaigns overspend early or miss budget. If guardrails are wrong, short-term revenue can damage members or advertisers.

**Worked example — no pacing vs feedback pacing.** A Search Ads campaign has a $100 daily budget and is eligible for heavy morning traffic. Without pacing, it may win the first high-value impressions and spend the full $100 by noon, leaving no budget for afternoon queries. With feedback pacing, the multiplier is reduced when cumulative spend is above the target line, so the campaign competes selectively and remains eligible later. The best auction on one impression is not necessarily the best delivery policy over the day.

**You'll be able to say:** *"Pacing is a feedback loop: compare cumulative spend to a time-based target, then raise or lower a multiplier or delivery probability so the campaign neither exhausts early nor underspends. Guaranteed delivery is constrained allocation over forecast supply, as in SHALE-style systems. Production allocation is multi-objective: value is optimized subject to advertiser ROI, member experience, frequency, policy, budget, and delivery guardrails."*

---

## Resources
- Budget Pacing at LinkedIn (Agarwal et al., 2014) (the pacing control loop in production)

## Papers
- Budget Pacing for Targeted Online Advertisements at LinkedIn (Agarwal et al., 2014)
- SHALE: guaranteed-display allocation (Bharadwaj et al., 2012)
- Bid Optimization by Multivariable Control (Yang et al., 2019)
