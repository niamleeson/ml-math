# Module Plan — M28 · Ads marketplace optimization

| Field | Value |
|---|---|
| Domain | Domain 6 · Optimization & Marketplace |
| Skip if you can already… | explain how a calibrated pCTR feeds a marketplace value/allocation |
| Maps to (projects) | Instream Ads perf, Event Ads perf, Search Ads |
| Primary structure(s) | S9 Mechanism / Marketplace |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 1 |

## Module hub (the "complete list")
This is the capstone marketplace module: M8's calibrated pCTR becomes value, M27's optimization
chooses an allocation under constraints, and the auction/payment/pacing system turns it into money
spent over time. The learner should leave able to compute a tiny marketplace by hand and explain
how calibration, auctions, pacing, and guardrails fit together in Instream, Event, and Search Ads.

- M28.1 · Value of an impression & the auction
- M28.2 · Budget pacing & guaranteed delivery

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is the value of an impression, and why is it calibrated pCTR × bid rather than raw model score × bid? → M28.1
- Why does calibration matter for marketplace allocation and advertiser/member outcomes? → M28.1, M28.2
- How do second-price and GSP auctions work, and how are payments computed? → M28.1
- How do you compute value-per-impression → winner → payment → pacing multiplier by hand? → M28.1, M28.2
- What is budget pacing as a feedback-control loop? → M28.2
- What is guaranteed delivery / SHALE allocation as constrained optimization? → M28.2
- How do multi-objective allocation and guardrail constraints enter the marketplace? → M28.2
- How do calibration + optimization + auction tie together end-to-end? → M28.1, M28.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- Value of impression = calibrated pCTR × bid **ƒ**
- Calibration as probability honesty; raw score vs calibrated probability (prose, links back to M8)
- Second-price / GSP auctions & payments **ƒ**
- Eligibility, ranking score, reserves/floors, expected revenue, member/ad-quality guardrails
- Budget pacing as feedback control **ƒ**; spend target, error, multiplier/clamp
- Guaranteed delivery / SHALE as constrained optimization; supply/demand allocation and delivery guarantees
- Multi-objective + guardrails: revenue, advertiser ROI, member experience, diversity, frequency, policy constraints
- End-to-end marketplace loop: predict → calibrate → value → pace → rank/allocate → price → observe spend/clicks → update

## Sub-lessons

### M28.1 · Value of an impression & the auction  —  [S9 Mechanism, ⚑]
- **Makes answerable:** value of an impression; why calibration matters; second-price/GSP auctions and payments; value-per-impression → winner → payment by hand; how calibration + auction connect.
- **You'll be able to say:** "For CPC ads, expected value per impression is calibrated pCTR × bid. Calibration matters because a 2% probability should mean about 2 clicks per 100 impressions; if pCTR is inflated, the marketplace over-ranks that ad and misprices opportunity. In a second-price/GSP-style auction, rank by value or quality-adjusted bid, allocate the slot(s), and charge the minimum price needed to keep the position, often derived from the next competitor's score."
- **Concepts:** value = calibrated pCTR × bid **ƒ**, calibrated probability, ranking score, second-price/GSP payments **ƒ**, reserve/floor, expected revenue, member-quality guardrails.
- **Key Idea focus:** mechanism = objective + incentives + allocation: scores estimate expected value, the auction allocates scarce attention, and the payment rule keeps bidding incentives interpretable.
- **Worked-example shape:** instance → value/allocation/payment. Build a three-advertiser, two-slot auction for Search/Event/Instream inventory; compute calibrated values; apply a reserve and a quality guardrail; choose winners; compute GSP prices; show how a miscalibrated pCTR changes the winner.
- **Notebook:** Yes — NumPy auction simulator shared with M28.2. Data includes calibrated pCTR, raw/miscalibrated pCTR, bids, quality penalties, slot multipliers, and reserves. Break case = one advertiser's raw score is 2× overconfident, causing inefficient allocation; `assert` calibrated allocation has higher realized expected value than raw-score allocation on synthetic clicks.
- **Real numbers to cite:** Three eligible advertisers for one Event Ads impression: A has calibrated pCTR 0.030 and bid \$6.00 CPC → value \$0.180; B has pCTR 0.020 and bid \$8.00 → \$0.160; C has pCTR 0.050 and bid \$2.00 → \$0.100. A wins by expected value. In a simple next-score CPC payment, A pays next value divided by A's pCTR: \$0.160 / 0.030 = \$5.33 per click, below A's \$6.00 bid. If A's raw uncalibrated score were 0.015, A's value would look like \$0.090 and B would win — a calibration-driven allocation error.

### M28.2 · Budget pacing & guaranteed delivery  —  [S9 Mechanism, ⚑]
- **Makes answerable:** budget pacing as feedback control; guaranteed delivery/SHALE allocation; multi-objective + guardrail constraints; computing value → winner → pacing multiplier; how calibration + optimization + auction tie together end-to-end.
- **You'll be able to say:** "Pacing is a feedback loop that compares cumulative spend to a time-based budget target, then raises or lowers a multiplier/probability so the campaign neither exhausts early nor underspends. Guaranteed delivery is constrained allocation: reserve enough eligible supply for contracted demand while respecting inventory, targeting, and guardrails. Production allocation is multi-objective: revenue is optimized subject to advertiser ROI, member experience, frequency, policy, and delivery constraints."
- **Concepts:** budget pacing as feedback control **ƒ**, pacing multiplier, target spend curve, spend error, delivery probability, guaranteed delivery / SHALE constrained optimization, multi-objective + guardrails, end-to-end marketplace loop.
- **Key Idea focus:** mechanism + control loop: auction values decide marginal opportunity, pacing decides whether the campaign should compete now, and constrained optimization protects delivery and guardrails over the horizon.
- **Worked-example shape:** instance → value/allocation/payment → control loop. Start with M28.1's auction, multiply each advertiser's value by a pacing multiplier, allocate and price, update spend, compute budget error, clamp the multiplier, then repeat for several impressions. Add a guaranteed Event Ads sponsor that must receive 40 impressions out of 100 eligible opportunities and show the allocation constraint.
- **Notebook:** Yes — simulate 100–1,000 impressions with `value = calibrated_pctr * bid`, second-price/GSP allocation, and a pacing multiplier that tracks spend to budget. Include a break case where no pacing spends a \$100 budget by noon, while feedback pacing stays near the target line; `assert` final spend is within a tolerance of budget for the paced campaign and overspends/underspends in the naive case. Signature viz = cumulative spend vs target, pacing multiplier over time, winner mix, and guardrail violations before/after.
- **Real numbers to cite:** Campaign A budget = \$100 over 10 hours, target by hour 3 = \$30. Actual spend after hour 3 = \$36, so error = target - actual = -\$6. A simple controller with multiplier update `m_next = clamp(m + 0.02 * error, 0.2, 1.5)` lowers `m` from 1.00 to 0.88. In the next auction, A's paced value becomes 0.88 × \$0.180 = \$0.158, so B's \$0.160 can win; pacing protects budget without permanently removing A. Guaranteed delivery mini-case: a reserved Event Ads deal needs 40/100 eligible impressions; an LP constraint `sum_t x_reserved,t >= 40` forces delivery, while guardrails cap frequency at 3/member and keep predicted hide-rate below 0.5%.

## Coverage check
All 8 module questions map to a sub-lesson: value, calibration, second-price/GSP, and auction payments → M28.1; pacing, guaranteed delivery/SHALE, multi-objective guardrails, pacing multiplier arithmetic, and end-to-end calibration→optimization→auction loop → M28.2. No gaps.

## Decision guide
| Marketplace decision | Mechanism to teach | Concrete ads question it answers |
|---|---|---|
| Which ad should get this impression? | Calibrated value ranking + auction | Which eligible Instream/Event/Search ad creates the highest expected value now? |
| What should the winner pay? | Second-price/GSP-style payment | What CPC clears the next-best competitor while respecting bid/floor? |
| Should an advertiser compete right now? | Budget pacing multiplier/probability | Is the campaign ahead or behind its spend target? |
| How do we meet contracts or guarantees? | Constrained optimization / SHALE | Which reserved impressions must be allocated to satisfy guaranteed delivery? |
| How do we protect the ecosystem? | Guardrail constraints + multi-objective scoring | Are member experience, frequency, policy, and advertiser ROI constraints still safe? |

## Resources (from the guide)
- Budget Pacing at LinkedIn (Agarwal et al., 2014) (the pacing control loop in production)

## SOTA papers (from the guide)
- Budget Pacing for Targeted Online Advertisements at LinkedIn (Agarwal et al., 2014)
- SHALE: guaranteed-display allocation (Bharadwaj et al., 2012)
- Bid Optimization by Multivariable Control (Yang et al., 2019)

## Notes / caveats
- This is the AFP-AI capstone for marketplace optimization; make it ads-concrete in every example, not a generic auction lecture.
- Tie backward explicitly: M8 supplies calibrated probabilities; M27 supplies LP/QP, duals, and constraints; M28 turns them into allocation, payment, pacing, and delivery.
- Escape literal currency as \$ in math-like contexts; use real dollar numbers so learners can recompute every step by hand.
- Keep mechanism math genuine but not excessive: value, payment, pacing update, and constrained allocation are central; avoid inventing formulas for policy or quality guardrails when prose and thresholds are clearer.
