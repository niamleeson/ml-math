# M23 · RLHF, DPO, PPO
> **Domain:** Domain 5 · Bandits & RL · **Maps to:** Creative Intelligence · **Skip if you can already…** design a finetuning plan for LLM RL tuning

## Overview

RL tuning starts from a supervised assistant, turns preferences into an optimization signal, and then improves the policy without letting it drift into reward hacking. In Creative Intelligence, the behavior target might be more useful creative critique, safer edits, better rationale quality, or stronger adherence to brand and policy constraints.

The practical distinction is simple: **RLHF with PPO** learns or uses an explicit reward model and then runs constrained policy optimization; **DPO** uses chosen/rejected preference pairs directly and looks more like supervised fine-tuning with a preference loss.

**By the end you can answer:**
- What is the RLHF pipeline: SFT → reward model → RL?
- How is a reward model trained from human preferences with Bradley-Terry?
- What is the PPO clipped objective, and why add a KL-to-reference penalty?
- What is DPO's closed form, and how does it skip an explicit reward model?
- PPO vs DPO — when should you use each?
- How do you design an RL-tuning plan for an LLM?

Two sub-lessons:

- **M23.1 RLHF pipeline & reward modeling** — turning comparisons into a reward model.
- **M23.2 PPO vs DPO & designing an RL-tuning plan** — choosing the constrained update.

---

## M23.1 · RLHF pipeline & reward modeling

**The idea.** RLHF usually has five steps.

**Everyday analogy.** Training with RLHF is like teaching a dog new manners after it already knows basic commands. The SFT model is the dog that can sit and stay; human raters are the owners saying which behavior they prefer; the reward model learns what earns treats; and policy optimization nudges the dog toward treat-earning behavior without letting it forget the house rules. For a model, the "treat" is a learned reward score for helpful, safe, on-brand answers.

1. Train or choose an SFT/reference policy $\pi_{\text{sft}}(y\mid x)$.
2. Collect prompts and multiple candidate responses.
3. Ask raters to choose a winner $y_w$ over a loser $y_l$ under a rubric.
4. Fit a reward model $r_\phi(x,y)$ that scores winners higher.
5. Optimize a policy against that reward while constraining drift from the reference.

For Creative Intelligence, the prompt might ask for a creative rewrite, a policy-safe headline, or an explanation of why an ad variant is weak. The preference rubric should name what "better" means: useful, specific, safe, factual, on-brand, and not over-claiming.

The reward model is pairwise preference classification. Bradley-Terry says

$$P(y_w \succ y_l\mid x)=\sigma(r_\phi(x,y_w)-r_\phi(x,y_l)),$$

where

$$\sigma(z)=\frac{1}{1+e^{-z}}.$$

The loss for one comparison is

$$\mathcal{L}_{\text{RM}}=-\log\sigma(r_\phi(x,y_w)-r_\phi(x,y_l)).$$

This formula matters because the reward model learns relative preference. Adding 10 to both rewards changes nothing; increasing the winner-loser gap increases predicted preference probability.

**Worked example — Bradley-Terry by hand.** A rater prefers response A to response B for a sponsored-content rewrite. The current reward model scores:

- winner score: $r_w=1.2$;
- loser score: $r_l=0.1$.

The logit is

$$r_w-r_l=1.1.$$

So

$$P(A\succ B)=\sigma(1.1)\approx0.75,$$

and the loss is

$$-\log(0.75)\approx0.29.$$

If the model reversed the pair with $r_w=0.2$ and $r_l=1.0$, then

$$\sigma(-0.8)\approx0.31,$$

and the loss would be

$$-\log(0.31)\approx1.17,$$

so training would strongly push the winner above the loser.

A minimum preference table has:

| field | why it matters |
|---|---|
| `prompt` | conditioning context |
| `chosen` | preferred response |
| `rejected` | less preferred response |
| `rubric` | what raters optimized |
| `slice` | language, vertical, creative type, safety bucket |

```python
for prompt, chosen, rejected in pairs:
    rw = reward_model(prompt, chosen)
    rl = reward_model(prompt, rejected)
    loss = -log_sigmoid(rw - rl)
```

**Reward-model traps.** A model can overfit to length, politeness, boilerplate, or policy disclaimers. Held-out preference accuracy must be compared to baselines such as majority class and length-only scoring. Slice checks matter: a reward model that works on generic English prompts may fail on regulated verticals, short high-quality copy, or non-English ads.

**Designing the reward-model part of a plan.** State the behavior target, collect preference pairs from realistic prompts, split by prompt/source to avoid near-duplicate leakage, train the reward model, validate against shortcuts, and freeze eval gates before policy optimization.

**You'll be able to say:** *"RLHF starts with SFT, collects chosen/rejected preference pairs, trains a reward model with Bradley-Terry probability $\sigma(r_w-r_l)$, then optimizes a policy against that reward while controlling drift. I validate by baselines and slices so the reward model learns Creative Intelligence quality rather than shortcuts like length."*

---

## M23.2 · PPO vs DPO & designing an RL-tuning plan

**The idea.** PPO-style RLHF uses the reward model as a scalar objective. The policy samples responses, receives reward, estimates an advantage $A_t$, and updates with a clipped probability ratio:

**Everyday analogy.** PPO is like training that same dog with a leash: reward the better behavior, but do not let one enthusiastic step turn into a wild sprint away from everything it already learned. The reward model is the treat signal, the KL/reference penalty is "stay close to your old reliable behavior," and PPO's clip is the short leash on each update. DPO is the simpler coach who skips building a separate treat-meter and learns directly from pairs like "answer A was better than answer B."

$$r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\text{old}}(a_t\mid s_t)},$$

$$\mathcal{L}^{\text{clip}}(\theta)=\mathbb{E}_t\left[\min(r_t(\theta)A_t,\text{clip}(r_t(\theta),1-\epsilon,1+\epsilon)A_t)\right].$$

The clip prevents one update from making the new policy too different from the sampling policy. RLHF also constrains the tuned model to the reference model, often with

$$\mathbb{E}[r_\phi(x,y)]-\beta D_{\text{KL}}(\pi_\theta(\cdot\mid x)\|\pi_{\text{ref}}(\cdot\mid x)).$$

The KL penalty protects general helpfulness, style, and safety behavior from being overwritten by a narrow reward model.

**Worked example — PPO clipping.** Let $A=2$, $r=1.4$, and $\epsilon=0.2$.

- Unclipped update: $rA=1.4\cdot2=2.8$.
- Clipped ratio: $\text{clip}(1.4,0.8,1.2)=1.2$.
- Clipped update: $1.2\cdot2=2.4$.
- PPO uses $\min(2.8,2.4)=2.4$.

The good action still becomes more likely, but the step is capped. A KL budget such as about 0.01–0.1 nats/token is a tuning constraint, not a universal target.

**DPO.** Direct Preference Optimization skips the deployed reward model and online RL loop. It uses chosen/rejected pairs and a reference model:

$$\mathcal{L}_{\text{DPO}}=-\log\sigma\left(\beta\left[\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\text{ref}}(y_w\mid x)}-\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\text{ref}}(y_l\mid x)}\right]\right).$$

Let

$$\Delta_\theta=\log\pi_\theta(y_w\mid x)-\log\pi_\theta(y_l\mid x),$$

and

$$\Delta_{\text{ref}}=\log\pi_{\text{ref}}(y_w\mid x)-\log\pi_{\text{ref}}(y_l\mid x).$$

DPO rewards the tuned policy when $\Delta_\theta-\Delta_{\text{ref}}$ is positive: it prefers the winner more strongly than the reference did.

**Worked example — DPO gap.** Suppose:

- $\log\pi_\theta(y_w)=-8$ and $\log\pi_\theta(y_l)=-10$, so $\Delta_\theta=2$;
- $\log\pi_{\text{ref}}(y_w)=-7$ and $\log\pi_{\text{ref}}(y_l)=-8$, so $\Delta_{\text{ref}}=1$;
- $\beta=0.5$.

The DPO logit is

$$0.5(2-1)=0.5,$$

so the loss is

$$-\log\sigma(0.5)\approx0.47.$$

```python
delta_theta = logp_theta_chosen - logp_theta_rejected
delta_ref = logp_ref_chosen - logp_ref_rejected
loss = -log_sigmoid(beta * (delta_theta - delta_ref))
```

**RLHF vs DPO vs PPO — one shared summarizer scenario.** Suppose Creative Intelligence is tuning a model that summarizes why an Event Ad creative is weak. The prompt is: "Explain why this webinar ad underperforms and suggest a safer rewrite." Raters prefer output **A** because it names the weak hook and avoids unverifiable claims; they reject **B** because it is generic and over-promises attendance.

| Method | What it optimizes | Pick it when... | Concrete instance |
|---|---|---|---|
| **RLHF pipeline** | A policy objective built from human preference data, usually a learned reward $r_\phi(x,y)$ plus a constraint to stay near $\pi_{\text{ref}}$ | You need an explicit, inspectable reward signal or multiple reward terms | Train $r_\phi$ so A scores above B, then optimize summaries for helpfulness + policy safety while penalizing drift from the SFT summarizer |
| **PPO** | The sampled policy's expected reward with a clipped ratio and KL/reference penalty | You can sample online/offline rollouts and need tight control over update size | Generate fresh summaries, score them with the reward model, and use PPO so "more specific critique" improves without suddenly producing unsafe claims |
| **DPO** | The chosen-vs-rejected log-probability gap relative to the reference, using pairs directly | You mostly have static preference pairs and want a supervised-like stable tuning loop | Feed the A-over-B pair to DPO so the tuned model assigns A a larger relative log probability than the SFT reference did, without training a separate reward model |

The easy confusion: **RLHF is the overall preference-to-policy pipeline**, **PPO is one RL optimizer often used inside it**, and **DPO is an alternative preference loss that skips the explicit reward-model-and-RL loop**.

**PPO vs DPO.**

| Situation | Prefer PPO-style RLHF | Prefer DPO |
|---|---|---|
| Data | reward model or scalar reward | offline chosen/rejected pairs |
| Control | reward shaping, KL schedules, online sampling | stable supervised-like loop |
| Risk | more moving pieces and reward hacking | less flexible; data/reference-limited |
| Creative Intelligence use | multiple rewards for safety, helpfulness, factuality | align outputs to preferred creative examples |

A complete tuning plan says: start from SFT, define the product behavior, collect representative preference pairs, choose DPO for stable offline preference tuning or PPO for explicit reward control, keep a reference model, track KL/log-prob drift, evaluate win rate and safety regressions, then launch gradually with monitoring.

**You'll be able to say:** *"PPO uses a clipped probability-ratio objective plus a KL-to-reference penalty so reward optimization cannot move too far. DPO directly increases the tuned model's chosen-vs-rejected log-prob gap relative to the reference. I use DPO for simpler preference tuning and PPO when I need explicit rewards, online sampling, or richer constraints."*

---

## Resources
- OpenAI — Spinning Up in Deep RL (policy gradients and PPO)
- HuggingFace — RLHF / TRL (reward modeling + PPO/DPO in practice)
- DeepLearning.AI — RLHF (the pipeline end to end)

## Papers
- InstructGPT / Training LMs to follow instructions with human feedback (Ouyang et al., 2022)
- Proximal Policy Optimization (Schulman et al., 2017)
- Constitutional AI (Bai et al., 2022)
