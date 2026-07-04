# Module Plan — M23 · RLHF, DPO, PPO

| Field | Value |
|---|---|
| Domain | Domain 5 · Bandits & RL |
| Skip if you can already… | design a finetuning plan for LLM RL tuning |
| Maps to (projects) | Creative Intelligence |
| Primary structure(s) | S2 Method / Algorithm + Decision |
| Example type | ⚑ Both |
| Sub-lessons | 2 |
| Notebooks | 2 |

## Module hub (the "complete list")
RL-tuning starts from a supervised assistant, turns human preferences into an optimization signal,
and then updates the policy without letting it drift away from the reference model. This module makes
that pipeline answerable: how reward modeling works, what PPO is optimizing, why DPO can skip the
explicit reward model, and how to pick a tuning plan for an LLM product.

- M23.1 · RLHF pipeline & reward modeling (Bradley-Terry)
- M23.2 · PPO vs DPO & designing an RL-tuning plan

## Questions this module answers (→ which sub-lesson teaches the answer)
- What is the RLHF pipeline: SFT → reward model → RL? → M23.1
- How is a reward model trained from human preferences with Bradley-Terry? → M23.1
- What is the PPO clipped objective, and why add a KL-to-reference penalty? → M23.2
- What is DPO's closed form, and how does it skip an explicit reward model? → M23.2
- PPO vs DPO — when should you use each? → M23.2
- How do you design an RL-tuning plan for an LLM? → M23.1, M23.2

_Every question maps to a sub-lesson (coverage confirmed below)._

## Concepts (ƒ = genuine, central formula)
- RLHF pipeline: SFT policy, preference collection, reward model, policy optimization
- Human preference pairs: chosen/winner response vs rejected/loser response
- Reward model with Bradley-Terry preference probability **ƒ**
- PPO clipped probability-ratio objective **ƒ**; advantage estimate; KL-to-reference penalty **ƒ**
- DPO direct preference objective / closed-form reward-ratio view **ƒ**
- Reference policy, reward hacking, over-optimization, KL budget, safety/eval gates
- PPO vs DPO selection; LLM RL-tuning plan design

## Sub-lessons

### M23.1 · RLHF pipeline & reward modeling (Bradley-Terry)  —  [S2 Method, ⚑]
- **Makes answerable:** RLHF pipeline; reward model from human preferences; the reward-modeling slice of an LLM RL-tuning plan.
- **You'll be able to say:** "RLHF usually starts with SFT, collects pairwise human preferences, fits a reward model that assigns higher reward to the chosen answer, then optimizes the policy against that reward while constraining drift. Bradley-Terry models `P(w preferred to l)=σ(r_w-r_l)`, so reward learning is logistic preference classification."
- **Concepts:** SFT → preference data → reward model → RL; chosen/rejected pairs; Bradley-Terry **ƒ**; reward hacking and validation splits.
- **Key Idea focus:** step-by-step pipeline: define behavior target, collect comparisons, train/validate reward model, then use it only with safety and KL controls.
- **Worked-example shape:** 10+5+5 process ramp — label preference pairs, compute `σ(r_w-r_l)` for a few reward scores, diagnose reward-model overfit, then connect the trained scorer to policy optimization.
- **Notebook:** Yes — tiny synthetic prompt/chosen/rejected table; fit/log-score a Bradley-Terry-style reward head; `assert` winners receive higher average reward on held-out pairs. Break case = annotator shortcut where response length predicts preference and fails on a short-high-quality slice.
- **Real numbers to cite:** if `r_w=1.2` and `r_l=0.1`, `σ(1.1)=0.75`; held-out preference accuracy target should be compared to a majority/length baseline, not read alone.

### M23.2 · PPO vs DPO & designing an RL-tuning plan  —  [S2 Method + Decision, ⚑]
- **Makes answerable:** PPO clipped objective; KL-to-reference penalty; DPO closed form; PPO vs DPO selection; full LLM RL-tuning plan.
- **You'll be able to say:** "PPO updates with a clipped likelihood ratio so a policy step cannot move too far, and RLHF adds a KL penalty to the SFT/reference policy to preserve useful behavior. DPO uses preference pairs directly: it increases the policy's log-prob gap between chosen and rejected responses relative to the reference, avoiding a separate reward model and online RL loop. Use DPO for simpler stable preference tuning; use PPO when you need an explicit reward, non-pairwise objectives, or online/control-loop optimization."
- **Concepts:** PPO ratio/clipping **ƒ**, advantage, KL-to-reference **ƒ**, DPO objective **ƒ**, reference model, selection tradeoffs, eval gates.
- **Key Idea focus:** algorithm steps + decision: PPO = reward-model-driven constrained policy optimization; DPO = direct offline preference optimization.
- **Worked-example shape:** 10+5+5 process ramp — compute a PPO ratio and clipped term, compute a DPO log-prob preference gap, then choose PPO or DPO for three tuning scenarios.
- **Notebook:** Yes — toy token-logprob table for chosen/rejected responses; compute DPO loss and a PPO clipped surrogate in numpy; `assert` clipping caps an oversized ratio. Break case = optimizing without KL/reference, causing policy to put extreme probability on reward-model artifacts.
- **Real numbers to cite:** `r=1.4`, `ε=0.2`, positive advantage ⇒ clipped ratio uses `min(1.4A,1.2A)`; a KL budget such as ~0.01–0.1 nats/token is a tuning constraint, not a universal target.

## Coverage check
All 6 module questions map to a sub-lesson: pipeline and Bradley-Terry reward modeling → M23.1; PPO, KL, DPO, PPO-vs-DPO, and plan design → M23.2. No gaps.

## Decision guide
| Situation | Prefer PPO-style RLHF | Prefer DPO |
|---|---|---|
| Data | Preference data plus a reward model you trust, or objectives beyond pairwise preferences | Offline chosen/rejected preference pairs |
| Control | Need explicit reward shaping, KL schedules, online sampling, or multiple constraints | Need a simpler supervised-like tuning loop |
| Risk | More moving pieces: reward hacking, instability, cost | Less flexible; inherits reference/data limits |
| Best use | Complex alignment/control-loop tuning | Stable preference alignment after SFT |

## Resources (from the guide)
- OpenAI — Spinning Up in Deep RL (policy gradients and PPO)
- HuggingFace — RLHF / TRL (reward modeling + PPO/DPO in practice)
- DeepLearning.AI — RLHF (the pipeline end to end)

## SOTA papers (from the guide)
- InstructGPT / Training LMs to follow instructions with human feedback (Ouyang et al., 2022)
- Proximal Policy Optimization (Schulman et al., 2017)
- Constitutional AI (Bai et al., 2022)

## Notes / caveats
- Keep the genuine math: Bradley-Terry, PPO clipping, KL-to-reference, and DPO. Do not add RL theory beyond what makes RLHF/DPO/PPO answerable.
- Emphasize product/eval gates for Creative Intelligence: helpfulness, safety, style, and regression checks before launch.
